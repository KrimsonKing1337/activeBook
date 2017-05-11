### Описание:

**activeBook** - это новый вид повествования, который является ответвлением обычных книг.

Это та же книга, но с эффектами:
звуки и музыка на заднем плане, всплывающие подсказки, видео, изображения и даже вибрация.

Всё это позволяет читателю углубиться в повествование ещё сильнее, создать свою, неповторимую атмосферу истории. А так же добавить конкретику в местах, когда хочется, чтобы читатель представлял нечто себе в голове точно так же как это представляет писатель.

Помимо этого, эту идею можно так же использовать для написания детских рассказиков, которые обычно родители читают с детьми.

А также ведение личного дневника.

### Чтобы развернуть рабочую среду, требуется:

### node.js, npm:

**Windows:**
 
https://nodejs.org/en/download/

**Ubuntu:**
 
(_Если нужно обновить версию, сначала делаем purge nodejs npm_)
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs 
```
### scss:

**Windows:**

http://rubyinstaller.org/
```gem install sass```

**Ubuntu:**
```
sudo apt-get install ruby-full
sudo su -c "gem install sass"
```
Установится в /usr/local/bin/scss 

### ffmpeg:

**Windows:**

http://ffmpeg.zeranoe.com/builds/

**Ubuntu:**
```
sudo add-apt-repository ppa:jonathonf/ffmpeg-3
sudo apt update && sudo apt install ffmpeg libav-tools x264 x265
```
(_собирать из исходников с поддержкой ogg?_)

### git, git flow:
**Windows:**

https://git-scm.com/download/win

https://github.com/nvie/gitflow/wiki/Windows

**Ubuntu:**
```
sudo apt-get install git-flow
```

Далее ставим PhpStorm (https://www.jetbrains.com/phpstorm/), делаем ```git clone```.
В PhpStorm настраиваем file watcher для scss, а так же node.js (Enable core).
Устанавливаем плагин git flow.
Далее выполняем ```npm install```, чтобы node.js установила все зависимости, указанные в package.json.
Все новые модули устанавливаем через ```nmp install --save```, чтобы они автоматически прописывались в package.json.

Все изменения производим в отдельной ветке, через git flow (что это такое и зачем нужно, можно почитать здесь: https://danielkummer.github.io/git-flow-cheatsheet/index.ru_RU.html).