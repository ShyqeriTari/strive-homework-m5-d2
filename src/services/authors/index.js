
import express from "express" 
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import uniqId from "uniqId" 
import cors from "cors"


console.log("CURRENT FILE URL: ", import.meta.url)
const currentFilePath = fileURLToPath(import.meta.url)
console.log("CURRENT FILE PATH: ", currentFilePath)


const parentFolderPath = dirname(currentFilePath)
console.log("PARENT FOLDER PATH ", parentFolderPath)



const authorsJSONPath = join(parentFolderPath, "authors.json")
console.log("USERS JSON FILE PATH: ", authorsJSONPath)

const authorsRouter = express.Router() 
authorsRouter.post("/", cors(), (request, response) => {
  console.log("BODY: ", request.body) 

  const newAuthor = { ...request.body, id: uniqId() } 


  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


  authorsArray.push(newAuthor)

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray)) 



  response.status(201).send({ id: newAuthor.id })
})


authorsRouter.get("/", cors(), (request,  response) => {

  const fileContent = fs.readFileSync(authorsJSONPath) 
  console.log("FILE CONTENT: ", JSON.parse(fileContent))


  const authorsArray = JSON.parse(fileContent) 



  response.send(authorsArray)
})


authorsRouter.get("/:authorId", (request, response) => {
  console.log("REQ PARAMS: ", request.params.authorId)


  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


  const foundAuthor = authorsArray.find(author => author.id === request.params.authorId)


  response.send(foundAuthor)
})


authorsRouter.put("/:authorId", cors(), (request, response) => {

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


  const index = authorsArray.findIndex(author => author.id === request.params.authorId)
  const oldAuthor = authorsArray[index]
  const updatedAuthor = { ...oldAuthor, ...request.body}

  authorsArray[index] = updatedAuthor


  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))



  response.send(updatedAuthor)
})


authorsRouter.delete("/:authorId", cors(), (request, response) => {

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


  const remainingAuthors = authorsArray.filter(author => author.id !== request.params.authorId)


  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))



  response.status(204).send()
})

export default authorsRouter