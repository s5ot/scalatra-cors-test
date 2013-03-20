package jp.classmethod.scalatracorsclient

import org.scalatra._
import scalate.ScalateSupport

class RootController extends ScalatracorsclientStack {

  get("/") {
    contentType = "text/html"
    jade("index");
  }
  
}
