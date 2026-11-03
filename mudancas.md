# Atualizaçoes Prisma

Bem basicamente eu quero mudar o grimorio de um Crm de tormenta20 para um "Fazedor de fichas", para todos os 
sistemas que quisermos, incluindo um sistema geral, aonde poderemos adicionar qualquer um dos outros, ou 
sistemas proprios.

- Eu estou documentando aqui oque eu quero fazer, para ter um preparo antes de sair fazendo qualquer coisa.

´´´prisma
model User {
  id         Int        @id @default(autoincrement())
  email      String     @unique
  password   String
  name       String
  fichas     Ficha[]
  campanhas  Campanha[]
  campanhaId Int?
}
´´´

----

O importante do model User para podermos fazer fichas de outros sistemas e o campo fichas,que hoje recebe Ficha[]
que tem o model do que precisa para se criar uma ficha em tormenta20. 

Atualmente eu andei pensando em 2 soluçoes.

- Criar um estilo de ficha e ir adicionando no model de User, oque e mais facil, mas escala muito mau, pelo fato de que,talvez
precisaremos ficar adicionando um novo item, ao User.

Eu nem me lembro mais qual era a segunda opçao, mas eu vou ficar com a primeira, porque de qualquer forma a gente vai ter que
mecher no backend/campos do schema prisma, e tanto faz o User ter 3 ou 40 itens, alem do mais que para sistemas pequenos, 
nos podemos so utilizar o sistema geral de fichas.

---



## Lista de tarefas
- [ ] Criar um schema de fichas gerais, vai ser o primereiro que vamos fazer.
- [ ] Melhorar o sistema de criaçao de fichas para criar melhor, e nao ter que usar 1MI de rotas diferentes para cada sistema.
- [ ] Metodo de crud de fichas pelo nome separado pelo nome dos sistemas.
- [ ] Dar um jeito de verificar na criaçao se os itens estao minimos estao corretos para cada sistema.

