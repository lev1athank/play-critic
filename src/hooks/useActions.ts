
import { useDispatch } from 'react-redux';
import { useMemo } from 'react'
import {bindActionCreators} from '@reduxjs/toolkit'
import { actions as regState } from '@/store/favorites/registr.slice'
const rootActions = {
    ...regState
}


export const useActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => 
        bindActionCreators(rootActions, dispatch), [dispatch])
}