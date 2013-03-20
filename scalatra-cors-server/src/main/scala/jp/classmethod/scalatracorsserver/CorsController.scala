package jp.classmethod.scalatracorsserver

import org.scalatra._
import org.scalatra.json._
import org.json4s._

class CorsController extends ScalatraServlet with JacksonJsonSupport with CorsSupport {

  override protected implicit val jsonFormats = DefaultFormats
  private[this] val postRepo = new PostRepository

  before() {
    contentType = formats("json")
  }

  get("/") {
    params.getAs[String]("name") match {
      case Some(name) => postRepo getPostsByName name
      case None => postRepo.allPosts 
    }
  }

  post("/") {
    parsedBody.extractOpt[Post] match {
      case Some(post) => 
        postRepo addPost post
        Ok()
      case _ => halt(400, "invalid params")
    }
  }

  notFound {
    halt(404)
  }
}
