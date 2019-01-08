const fs = require('fs');
const path = require("path");
const chalk = require('chalk');
const filePath = path.resolve(__dirname, '../public/build');
const readPath = path.resolve(__dirname, 'dist/static')
var fileObj = {};

//读取文件夹下的所有文件
fs.readdir(readPath,function(err,files){
    if(err){return;}
    var count = files.length;
    var results = {};
    files.forEach(function(filename){
        fs.stat(path.join(readPath,filename),function(err, stats){
            if (err) throw err;
            //文件
            if(stats.isFile()){

            }else if(stats.isDirectory()){
                var name = filename;
                readFile(path.join(readPath,filename),name);
            }
        });
    });
});

//获取后缀名
function getdir(url){
    var arr = url.split('.');
    var len = arr.length;
    return arr[len-1];
}
//获取文件数组
function readFile(readurl,name){
    var name = name;
    fs.readdir(readurl,function(err,files){
        if(err){return;}
        // console.log('files',files)
        files.forEach(function(filename){
            fs.stat(path.join(readurl,filename),function(err, stats){
                if (err) throw err;
                //是文件
                if(stats.isFile() && (getdir(filename) == 'css'  || getdir(filename) == 'js')){

                    var fileArr = readurl.split('/'),
                        fileType = fileArr[fileArr.length -1],
                        nameArr = filename.split('.'),
                        name = nameArr[0],
                        nameFile = fileType+'/'+name+'.'+getdir(filename);
                    
                    //if(name == 'js' || name == 'css'){
                        fileObj[nameFile] = fileType+'/'+filename;
                        writeFile()
                    //}
                    
                    //是子目录
                }else if(stats.isDirectory()){
                    var dirName = filename;
                    readFile(path.join(readurl,filename),name+'/'+dirName);
                }
            });
        });
    });
}

// 写入到rev-manifest.json
function writeFile(){
    fs.writeFile(readPath+"/"+"rev-manifest.json",JSON.stringify(fileObj),function(err){
        if(err) throw err;
        console.log(chalk.cyan('  version complete.\n'))
    });
}