nos vamos primeiramente enquanto estamos criando, 
vamos adicionando os valores as pericias 
e vamos enviar um array no json com as 29 pericias
nos qual nos vamos colocar no createMany 

{
    fichaId:number
    [
      "atributo":"Des"
      "metadeDoNivel":2
      "treino":0,
      "outros"
    ]
    ...
}

type Pericias = {
    nome:string,
    atributo:string,
    metadeDoNivel:number,
    treino:number,
    outros:number
}

Router.post("/pericias/create/",async (req:Request,res:Response) => {
    const {array}:Array<Pericias> = req.body;
    try{
        const pericias = await prisma.pericias.createMany({
            data:[
                {
                    atributo:array[0].atributo,metadeDoNivel:array[0].metadeDoNivel,
                    treino:array[0].treino,outros:array[0].outros, fichaId:array[0].fichaId, 
                    nome:array[0].nome
                }
                //... e assim por diante como tem pericias fixas isso deve ser feito  29 vezes com todas as pericias 
            ]
        })

    }catch(err){
        console.log(err)
        res.status(400).json({Error:err,ErrorMessage:"Erro ao criar as pericias"})
    }
})
