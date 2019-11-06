import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_PROFILE
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user:null
}

export default function( state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case USER_LOADED:            
            return {
                ...state,
                loading: false,
                user: payload
            }
            case REGISTER_SUCCESS:
            case LOGIN_SUCCESS:
                      localStorage.setItem('token', payload.token);
                      return {
                        ...state,
                        ...payload,
                        isAuthenticated: true,
                        loading: false
                      };
        case REGISTER_FAIL:
        case AUTH_ERROR:  
        case LOGIN_FAIL:  
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token:null,
                isAuthenticated: false,
                loading: false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        default:
            return state;
    }
}