class VideoPlayer {
    constructor() {
        this.$videoWrapper = $('.video-wrapper');
        this.$videoPlayer = this.$videoWrapper.find('.video-player');
        this.$video = this.$videoWrapper.find('video');
        this.$controls = this.$videoWrapper.find('.js-video-player-controls');
        this.$iconPlay = this.$videoWrapper.find('.js-video-player-icon-play');
        this.$iconPause = this.$videoWrapper.find('.js-video-player-icon-pause');
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
        this.$iconPlay.removeClass('active');
        this.$iconPause.addClass('active');
        this.$videoPlayer.attr('data-playing', true);
    }

    pause() {
        this.$video[0].pause();
        this.$iconPause.removeClass('active');
        this.$iconPlay.addClass('active');
        this.$videoPlayer.attr('data-playing', false);
    }
}

export const videoPlayerInst = new VideoPlayer();