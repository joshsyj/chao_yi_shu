const Koa = require('koa');
const app = new Koa();
const axios = require('axios')
const token = 'b36bb154f59a79301e0e1f0ed243d640'
const instance = axios.create({
  baseURL: 'https://app.chaoyishu.art/api.php/',
  timeout: 2000,
  headers: {
    origin: 'https://app.chaoyishu.art',
    'content-type': 'application/json;charset=UTF-8',
    'token': token
  }
});
let price = 600
let key = {
  261: '九尾狐',
  262:'火凤',
  263:'云麒麟'
}
let getList = () => {
  instance.post("document/packmarket", {
    "page": 1,
    "name": "",
    "price": "asc",
    "p_type": "",
    "is_sale": 1,
    "category_id": "261"
  }).then((res) => {
    let f = []
    res.data.result.filter((item) => {
      if (item.price <= price) {
        f.push(item.id)
      }
    })
    console.log(f)
    if (f.length) {

      createsellbuy(f)
    } else {
      getList()
    }
  })
}

let createsellbuy = async (list) => {
  for (let id of list){
    instance.post("order/createsellbuy", {
      id: id,
      "token": token
    }).then((res) => {
      console.log('res1',res)
      created()
      return
    });
    
  }
 
}

let created = () => {
    instance.post("user/userorder", {
      "status": 0,
      "page": 1,
      "token": token
    }).then((res) => {
      console.log('res2',res)
    });
}

getList()

app.listen(3000);