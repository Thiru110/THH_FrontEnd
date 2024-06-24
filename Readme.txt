here using Redux 

INSTALL REDUX TOOLKIT
    npm install @reduxjs/toolkit

INSTALL REACT REDUX DEPENDENCIE
    npm install react-redux

STEPS:
    1- Create a SLICE whatever we need..
    2- put the slice in STORE
    3- Wrap the <app/> for ex:
            <provider store={store}>
            <app/>
            <provider/>
    4- to get the data from the slice STATE using USESELECTOR()
       HOW TO GET?
            const aaaa=useSelector((state)=>state.auth.isAuthenticated)
                
                Form the state.slicename.isAuthenticated 
