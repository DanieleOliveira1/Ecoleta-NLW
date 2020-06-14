const express = require("express")
const server = express()

// pegar o banco de dados

const db = require("./database/db.js")

//configurar pasta pública
server.use(express.static("public")) //configuraão para o servidor

//habilitar o uso do req.body

server.use(express.urlencoded({extended:true}))
//página  inicial
//req:requisição/pedido
//res:resposta

//utilizando template engine
const nunjucks = require("nunjucks")
    nunjucks.configure("src/views", {
        express: server,
        noCache: true
    })


server.get("/", (req,res) =>{
   return res.render("index.html", {title:"Seu marketplace de resíduos"})
})

server.get("/create-point", (req,res) =>{
    //req.query: Query strings da url
     return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: corpo do formulário
    //console.log(req.body)
    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image, 
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (
            ?,?,?,?,?,?,?);
    `
    const values =  [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]
    console.log(req.body)

    function afterInsertData(err){
        if(err){
             console.log(err)
             return res.render("create-point.html", {err:true})
        }

        console.log("Cadastrado com sucesso")
        console.log(this)
        
        return res.render("create-point.html", {saved:true})

    }
    
    db.run(query, values, afterInsertData)
})

server.get("/search", (req,res) =>{

    const search = req.query.search

    if(search == ""){
        return res.render("search.html", {total:0})
    }

    
    //pegar do banco de dados
    db.all(` SELECT * FROM places `, function(err, rows){
        if(err){
            return console.log(err)
        }
        const total = rows.length //conta o total de elementos dentro do array
        //mostar a página html com o banco de dados
        return res.render("search.html", {places:rows, total:total})
    })
})

server.get("/modal", (req,res) =>{
    return res.render("modal.html")
})

//ligar o servidor
server.listen(3000) //função que ouve a porta 3000
