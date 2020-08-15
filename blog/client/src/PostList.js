import React, { useState, useEffect }from 'react'; 
import axios from 'axios'; 

export default() => {

    const [posts, setPosts] = useState({}); 

    const getPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts')
        setPosts (res.data); 
    }

    useEffect(()=>{
        getPosts(); 
    }, [])

    const renderedPosts = Object.values(posts).map(post => {
        return <div className="card" style={{ width: '30%', marginBottom:'20px' }} key={post.id}>
            <div>
                <h3>{post.title}</h3>
            </div>
        </div>
    })

    return (
        <div className="d-row flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    )
}