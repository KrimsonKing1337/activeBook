class VideoPlayer {
    constructor() {
        this.$modalContent = $(DOMSelectors.modalContent);
        this.$videoWrapper = this.$modalContent.find('.video-wrapper');
        this.$videoPlayer = this.$modalContent.find('.video-player');
        this.$video = this.$modalContent.find('video');
        this.$controls = this.$videoPlayer.find('.js-video-player-controls');
        this.$playIcon = this.$videoPlayer.find('.js-video-player-icon-play');
        this.$pauseIcon = this.$videoPlayer.find('.js-video-player-icon-pause');
    }

    init() {
        this.$videoWrapper.on('click', () => {
            this.playPauseToggle();
        });

        $('.js-video-player-play-pause').on('click', (e) => {
            e.stopPropagation();

            this.playPauseToggle();
        });
    }

    playPauseToggle() {
        if (JSON.parse(this.$videoPlayer.attr('data-playing')) === false) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.$video[0].play();
        this.$playIcon.removeClass('active');
        this.$pauseIcon.addClass('active');
        this.$videoPlayer.attr('data-playing', true);
    }

    pause() {
        this.$video[0].pause();
        this.$pauseIcon.removeClass('active');
        this.$playIcon.addClass('active');
        this.$videoPlayer.attr('data-playing', false);
    }
}

export const videoPlayerInst = new VideoPlayer();