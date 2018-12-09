import { all } from 'redux-saga/effects';
import Menu from '../menu/menu.saga';


export default function* RootSaga() {
  yield all([
    Menu()
  ]);
}

