import React, { useEffect, useState } from 'react';
import './App.css';
import { GoogleAuthProvider, signInWithPopup, getAuth, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initApp } from './util/firebase';

initApp()

function App() {

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider()
  const auth = getAuth()

  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      const user = {
        uid: userAuth?.uid,
        email: userAuth?.email,
        name: userAuth?.displayName,
        photo: userAuth?.photoURL
      }
      if (userAuth) {
        console.log(userAuth)
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  // console.log('useUser :>> ', user);

  const handleGoogleLogin = () => {

    signInWithPopup(auth, googleProvider)
      .then((result) => {

        const user = result.user;

        // console.log('user :>> ', user);

        setUser({
          uid: user?.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        })
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;

      });
  }

  const handleGithubLogin = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        console.log('result :>> ', result);
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.

        // The signed-in user info.
        const gitUser = result.user;

        setUser({
          uid: gitUser?.uid,
          name: gitUser.displayName,
          email: gitUser.email,
          photo: gitUser.photoURL
        })

        // console.log('gitUser :>> ', gitUser);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.

        // ...
      });
  }
  
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');

  const handleSignUp = (e) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        console.log('signUpUser :>> ', user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('user :>> ', user);

      setUser({
        uid: user?.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }) 
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    }); 
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('sign out successfully :>> ');
        setUser({})
      })
  }
  return (
    <div className="App">
      <button onClick={handleGoogleLogin}>Google Login</button>
      <button onClick={handleGithubLogin}>Github Login</button>

      <button onClick={handleSignOut}>Sign Out</button>

      <br /> <br /> <br />
      <form>
        <input type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your email" />
        <br /> <br />
        <input type="password" onChange={(e)=> setPassword(e.target.value)} name="password" placeholder="Enter your password" />
        <br /> <br />

        <button onClick={handleSignUp}>Sign up</button>
      </form>

      <form>
        <input type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your email" />
        <br /> <br />
        <input type="password" onChange={(e)=> setPassword(e.target.value)} name="password" placeholder="Enter your password" />
        <br /> <br />

        <button onClick={handleSignIn}>Sign in</button>
      </form>

      {
        user &&
        <div>
          <p>Hello  {user.email}</p>
          <p>User UID: {user.uid}</p>
          <h1>Hi {user.name}</h1>
          <img src={user.photo} alt="" srcset="" />
        </div>
      }
    </div>
  );
}

export default App;
