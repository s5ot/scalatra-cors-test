import jp.classmethod.scalatracorsserver._
import org.scalatra._
import org.scalatra.CorsSupport._
import javax.servlet.ServletContext

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext) {
    context.mount(new CorsController, "/posts/*")
    context.initParameters(AllowedOriginsKey) = "http://localhost:8080"
    context.initParameters(AllowedMethodsKey) = "GET, POST, OPTIONS"
    context.initParameters(AllowedHeadersKey) = "Content-Type"
    context.initParameters(PreflightMaxAgeKey) = "10"
    context.initParameters(AllowCredentialsKey) = "false"
  }
}
