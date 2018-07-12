https://active-book.ru

apk: https://yadi.sk/d/WB2eP2vb3YUmCY

### Описание:

**activeBook** - это новый вид повествования, который является ответвлением обычных книг.

Это книга в электронном формате, но с эффектами:
звуки и музыка на заднем плане, всплывающие подсказки, видео, изображения и даже вибрация.

Всё это позволяет читателю углубиться в повествование ещё сильнее, создать свою, неповторимую атмосферу истории. А так же добавить конкретику в местах, когда хочется, чтобы читатель представлял нечто себе в голове точно так же, как это представляет писатель.

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

### git:
**Windows:**

https://git-scm.com/download/win

**Ubuntu:**
```
sudo apt-get install git
```

Далее ставим PhpStorm (https://www.jetbrains.com/phpstorm/), делаем ```git clone```.
В PhpStorm включаем проверку синтаксиса node.js (Enable core).

Переходим в папку app *(это корневой каталог нашего приложения, все дальнейшие консольные команды выполняем отталкиваясь от неё)*.

Далее выполняем ```npm install```, чтобы node.js установил все зависимости, указанные в package.json.

Также устанавливаем webpack глобально ```npm -g install webpack```.

Если проект разворачивается под Windows, нужно установить ещё два пакета (они могут понадобиться в случаях, если требуется пересобрать какой-нибудь пакет - node-sass часто этого просит):

```
npm install --global --production windows-build-tools
npm install --global node-gyp
```


Все новые модули устанавливаем через ```nmp install --save``` или ```nmp install --save-dev``` чтобы они автоматически прописывались в package.json.

Все изменения производим в отдельной ветке.

___

https://active-book.ru

apk: https://yadi.sk/d/WB2eP2vb3YUmCY