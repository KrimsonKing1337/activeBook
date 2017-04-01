#!/bin/bash
#functions
function fileExtenstion {
    fileName=$(basename $file);
    extension=${file##*.};
    fileName=$(basename $fileName "."$extension);
    #file -b --mime-type $file; - вернёт mime-type файла
    echo $extension;
}

function fileName {
    fileName=$(basename $file);
    extension=${file##*.};
    fileName=$(basename $fileName "."$extension);
    echo $fileName;
}

function audios {
    cd ./audios;
    for file in $(find -type f -name "*.*"); do
        if [ "$(fileExtenstion $file)" = "mp3" ]
            then ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".ogg -y;
            
            elif [ "$(fileExtenstion $file)" = "ogg" ]
				then ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".mp3 -y;
            else 
				ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".mp3 -y;
				ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".ogg -y;
        fi
    done;
}

function videos {
    cd ./videos
    for file in $(find -type f -name "*.*"); do
        if [ "$(fileExtenstion $file)" = "mp4" ]
            then ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".webm -y;
            
            elif [ "$(fileExtenstion $file)" = "webm" ]
				then ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".mp4 -y;
            else 
				ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".mp4 -y;
				ffmpeg -i $file "$(dirname $file)/""$(fileName $file)".webm -y;
        fi
    done;
}

echo "activebBook helper converter"
echo "Какой тип файлов преобразовываем? 1 = Audios, 2 = Videos, 3 = All (по умолчанию)"
read fileType
case "$fileType" in
    1)
        echo "Ввели Audios"
        audios
    ;;
    2) echo "Ввели Videos";;
    3) echo "Ввели All";;
    *) echo "Просто нажали Enter";;
esac
