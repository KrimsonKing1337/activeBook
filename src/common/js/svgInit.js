export function svgInit() {
    /**
     * пробегаемся по каждому тэгу use
     * внутри svg.
     * ищем соответствующий тэгу <use> тэг <path>:
     * аттрибут у <use> xlink:href и id у <path> совпадают.
     * если нет <path> с таким id, значит несколько <use> ссылаются
     * на один и тот же <path>.
     * в этом случае записываем старый уникальный id и выходим из функции.
     * тогда у нас будет уникальный id и все <use> будут ссылаться
     * на один и тот же <path>
     */
    $('svg').each((i, item) => {
        const $svgCur = $(item);
        const svgCount = i;
        const $use = $svgCur.find('use');
        const $defs = $svgCur.find('defs');
        let oldCountValue = 0;

        $use.each((i, item) => {
            const $useCur = $(item);
            const id = $useCur.attr('xlink:href');
            const $path = $useCur.find(id);
            const $defsPath = $defs.find('path').eq(i);

            if ($defsPath.length === 0) {
                $useCur.attr('xlink:href', `#svg-id-${svgCount}-${oldCountValue}`);
                $path.attr('id', `svg-id-${svgCount}-${oldCountValue}`);
                return;
            }

            $defsPath.attr('id', `svg-id-${svgCount}-${i}`);
            $useCur.attr('xlink:href', `#svg-id-${svgCount}-${i}`);
            $path.attr('id', `svg-id-${svgCount}-${i}`);
            oldCountValue = i;
        });

        $svgCur.find('title').remove();
        $svgCur.wrap('<div class="obj-img__wrapper" />');
    });
}