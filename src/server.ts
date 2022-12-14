import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get( "/filteredimage", async ( req:express.Request, res:express.Response ) => {
    // const image_url:String = req.query.image_url; //This line shows syntax error I am forced to use the next line
    // I had to parse all variables to String to use them other wise I get a syntax error
    const image_url: String = req.query.image_url.toString();

    if(image_url){
      try{
        const filteredpath:String  = await filterImageFromURL(image_url.toString());//I parsed the image_url to String here

        res.status(200).sendFile(filteredpath.toString(),async ()=>{
          await deleteLocalFiles([filteredpath.toString(),""],);
        });
      }catch(error){
        res.status(500).send(error);
      }

    }else{
      res.status(404).send({"message":"Please Enter valid Image Url"})
    }
  } );
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send({"message":"try GET /filteredimage?image_url={{}}"})
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();