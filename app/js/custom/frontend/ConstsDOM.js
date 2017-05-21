export default class ConstsDOM {
    constructor () {

    }

    static get () {
        return {
            $text: $('.text'),
            $tableOfContents: $('.table-of-contents'),
            $menu: $('.menu')
        }
    }
}