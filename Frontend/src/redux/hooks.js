import { useDispatch, useSelector } from 'react-redux';

/**
 * Custom hook to use the Redux dispatch.
 */
export const useAppDispatch = () => useDispatch();

/**
 * Custom hook to use the Redux selector with state typing.
 */
export const useAppSelector = (selector) => useSelector(selector);
