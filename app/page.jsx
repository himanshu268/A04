import Feed from '@components/Feed';
import ProtectedRoute from '../components/ProtectedRoute';
const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text_center">
            Share
            <br className="max-md:hidden"/>
            <span className="orange_gradient text-center"> Your Thoughts,Emotions and many more</span>
            </h1>
            <p className="desc text-center">
                Arcane04 is an open source platform to share ideas,thoughts,emotion and many more
            </p>
        <Feed/>
    </section>
    )
}

export default Home