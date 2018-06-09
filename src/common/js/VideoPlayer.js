import getDOMSelectors from './GetDOMSelectors';

const DOMSelectors = getDOMSelectors();

export class VideoPlayer {
    /**
     *
     * @param modalId {string}
     */
    constructor(modalId) {
        this.$modalContent = $(DOMSelectors.modalContent).filter(`[data-modal-content-id=${modalId}]`);
        this.$videoWrapper = this.$modalContent.find('.video-wrapper');
        this.$videoPlayer = this.$videoWrapper.find('.video-player');
        this.$video = this.$videoWrapper.find('video');
        this.$controls = this.$videoWrapper.find('.js-video-player-controls');
        this.$iconPlay = this.$videoWrapper.find('.js-video-player-icon-play');
        this.$iconPause = this.$videoWrapper.find('.js-video-player-icon-pause');
        this.$iconPlayPause = this.$videoWrapper.find('.js-video-player-play-pause');
        this.id = modalId;
        this.enable = this.$video.attr('src') !== '';
        this.playing = false;
    }

    init() {
        this.$videoWrapper.on('click', () => {
            this.playPauseToggle();
        });

        this.$iconPlayPause.on('click', (e) => {
            e.stopPropagation();

            this.playPauseToggle();
        });

        this.$videoPlayer.data('videoPlayerInst', this);
        this.$videoPlayer.attr('data-video-player-id', this.id);
    }

    destroy() {
        this.$videoWrapper.off('click');
        this.$iconPlayPause.off('click');
        this.pause();
        this.$videoPlayer.data('videoPlayerInst', '');
    }


    playPauseToggle() {
        if (this.playing === false) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.$video[0].play();
        this.$iconPlay.removeClass('active');
        this.$iconPause.addClass('active');
        this.$videoPlayer.attr('data-playing', true);
        this.playing = true;
    }

    pause() {
        this.$video[0].pause();
        this.$iconPause.removeClass('active');
        this.$iconPlay.addClass('active');
        this.$videoPlayer.attr('data-playing', false);
        this.playing = false;
    }

    /**
     *
     * @param id {string}
     */
    static getInstById(id) {
        return $('.video-player').filter(`[data-video-player-id=${id}]`).data('videoPlayerInst');
    }

    /**
     *
     * @param method {string}
     */
    static async doForAll(method) {
        const promisesArr = [];

        $('.gallery').each((i, videoPlayerCur) => {
            const inst = VideoPlayer.getInstById($(videoPlayerCur).attr('data-video-player-id'));

            promisesArr.push(inst[method]());
        });

        return Promise.all(promisesArr);
    }

    static async playAll() {
        return VideoPlayer.doForAll('play');
    }

    static async pauseAll() {
        return VideoPlayer.doForAll('pause');
    }

    static async destroyAll() {
        return VideoPlayer.doForAll('destroy');
    }
}