if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');//배포할때
}else{
    module.exports = require('./dev');//개발할때
}

