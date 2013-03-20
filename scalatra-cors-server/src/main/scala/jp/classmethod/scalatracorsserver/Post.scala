package jp.classmethod.scalatracorsserver

case class Post(name: String, comment: String)

class PostRepository {

  private[this] var posts: Seq[Post] = IndexedSeq.empty[Post]

  def addPost(post: Post) {
    posts +:= post
  }

  def allPosts = posts

  def getPostsByName(name: String) = {
    posts filter { _.name == name }
  }
}