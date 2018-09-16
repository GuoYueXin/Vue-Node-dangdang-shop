import Mock from 'mockjs';
import data from './goods.json';

Mock.mock('/goods', {
  data: data
})
