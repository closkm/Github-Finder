import { useReducer, createContext } from 'react'
import githubReducer from './GithubReducer'


const GithubContext = createContext()

const GITHUB_URL = "https://api.github.com"

export const GithubProvider = ({children}) => {
    const initalState = {
        users: [],
        user: {},
        loading: false,
    }

    const [state, dispatch] = useReducer(githubReducer, initalState)

    const clearUsers = () => {
        dispatch({type: 'CLEAR_USERS'})
    }

    //search users
    const searchUsers = async (text) => {
        setLoading()

        const params = new URLSearchParams({
            q: text
        })

        const response = await fetch(`${GITHUB_URL}/search/users?${params}`)
        const {items} = await response.json()
        
        dispatch({
            type: 'GET_USERS',
            payload: items
        })
    }

    //get single user
    const getUser = async (login) => {
        setLoading()

        const response = await fetch(`${GITHUB_URL}/users/${login}`)
        if(response.status === 404){
            window.location = '/notfound'
        } else {
            const data = await response.json()
        
            dispatch({
                type: 'GET_USER',
                payload: data
            })
        }
    }
const setLoading = () => dispatch({type: 'SET_LOADING'})

return (<GithubContext.Provider value={{
    users: state.users,
    loading: state.loading,
    searchUsers,
    clearUsers,
    user: state.user,
    getUser
}}>
    {children}
</GithubContext.Provider>)
}


export default GithubContext