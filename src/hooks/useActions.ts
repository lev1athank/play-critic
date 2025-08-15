
import { useDispatch } from 'react-redux';
import { useMemo } from 'react'
import {bindActionCreators} from '@reduxjs/toolkit'
import { actions as regState } from '@/store/favorites/registr.slice'
import { actions as newGame } from '@/store/favorites/currentGame'
import { actions as search } from '@/store/favorites/search.slice'
const rootActions = {
    ...regState,
    ...newGame,
    ...search
}


export const useActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => 
        bindActionCreators(rootActions, dispatch), [dispatch])
}