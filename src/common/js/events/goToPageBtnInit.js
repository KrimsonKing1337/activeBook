import {effectsInst} from '../effects/Effects';
import LocalStorage from '../states/LocalStorage';
import {GoToPage} from '../menu/Menu';
import {pageInfo} from '../forAppInit/pageInfo';
import {getIsMobile} from '../helpers/getIsMobile.js';

const EffectsController = effectsInst();

/**
 *
 * @param goTo {string || number}
 */
function getPageToGo(goTo) {
    if (goTo === 'pageForResumeReading') {
        const pageForResumeReading = LocalStorage.read({key: 'pageForResumeReading'});
        const pageToGo = pageForResumeReading === 'credits' ? null : pageForResumeReading;

        return pageToGo ? pageToGo : 1;
    } else if (goTo === 'main') {
        return 0;
    }
}

/**
 * go to another page by fake link
 */
export function goToPageBtnInit() {
  const $goToPage = $('.go-to-page');

    if ($goToPage.length === 0) return;

    const pageCurNum = pageInfo.pageCurNum;
    const goTo = $goToPage.attr('data-go-to');
    const pageToGo = getPageToGo(goTo);

    /**
     * init text of start reading button on the main page
     */
    if (pageCurNum === 0) {
        if (pageToGo !== 1) {
            $goToPage.find('a').text('Продолжить читать');
        } else {
            $goToPage.find('a').text('Начать читать');
        }
    }

    $goToPage.on('click', () => {
      // if this is not mobile app - just go
      // if (getIsMobile() === false) {}

      // if app has asked about flashlight then go. if not - show modal
      if (LocalStorage.read({key: 'askedAboutFlashlight'}) === true) {
        go(pageToGo);
      } else {
        setHandlersForConfirmButtons();

        askAboutFlashlight();
      }
    });
}

function go(pageToGo) {
  const $goToPage = $('.go-to-page');

  setTimeout(() => {
    GoToPage.go({val: pageToGo});

    $goToPage.off('click');
  }, 500);
}

function setHandlersForConfirmButtons() {
  EffectsController.modalContentInst.setConfirmButtonsHandlers(() => {
    EffectsController.flashLightEffectsInst.stop();

    LocalStorage.write({key: 'askedAboutFlashlight', val: true});
  }, () => {
    LocalStorage.write({key: 'askedAboutFlashlight', val: true});
  });
}

function askAboutFlashlight() {
  EffectsController.play('confirm-flashlight');
}
