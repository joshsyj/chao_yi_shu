const Koa = require('koa');
const app = new Koa();
const axios = require('axios')
const open = require('open')
const FormData = require("form-data")
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxMzY0MTgzNjY5MCIsInNvdXJjZSI6InBjIiwidHlwZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY3Nzg2NTIwLCJzaWduSWQiOiJlZWJkYjU4ZDhhMWQ0NjNlYTRiOTU1ZTA2MjcwY2JlZiIsImlhdCI6MTY2NzE4MTcyMH0.fNt7qxREeOY3D9uvEOOuMyQbTuueehlkcU2Hwcu_mfI'
const instance = axios.create({
  baseURL: 'https://api.gandart.com/market/api/v2/',
  timeout: 2000,
  headers: {
    origin: 'https://api.gandart.com',
    Host: 'api.gandart.com',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    'token': token
  }
});

const instance2 = axios.create({
  baseURL: 'https://api.gandart.com/base/v2/',
  timeout: 2000,
  headers: {
    origin: 'https://api.gandart.com',
    Host: 'api.gandart.com',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    'token': token
  }
});
let price = 1999
let key = {
  111: '拾荒者',
  84: '探索者I-Shift',
  96: '涅槃之地',
  112: '龙蛋',
  95: '提灯'
}
let getList = () => {

  let params = new FormData()
  params.append('castingId', 96)
  params.append('page', 1)
  params.append('pageSize', 15)
  params.append('sort', 2)
  params.append('transactionStatus', 2)
  instance.post("resaleManage/resale/onSale", params).then((res) => {
    let f = []
    res.data.obj.list.forEach((item, index) => {
      if (index == 0) {
        console.log('最低价：' + item.resalePrice)
      }
      if (parseFloat(item.resalePrice) <= price && item.transactionStatus == 2) {
        f.push(item)
      }
    })
    console.log(f)
    if (f.length) {
      collectionDetails(f.slice(0, 1))
    }
    else {
      setTimeout(() => {
        getList()

      }, 1000)
    }
  }).catch(() => {
    console.log('error:list')
    setTimeout(() => {
      getList()

    }, 1000)
  })
}

let collectionDetails = (f) => {


  let arr = []
  for (let item of f) {
    let params = new FormData()
    params.append('transactionRecordId', item.id)
    instance.post("resaleManage/resale/collectionDetails", params).then((res) => {

      buy(item.id, res.data.obj)

    }).catch(e => {
      console.log('error')

      setTimeout(() => {
        getList()

      }, 1000)
    })
  }

}

let buy = (transactionRecordId, item) => {
  console.log(item)
  let params = new FormData()
  params.append('castingId', item.castingId)
  params.append('detailId', item.detailId)
  params.append('transactionRecordId', transactionRecordId)
  params.append('userId', item.userId)
  instance2.post("resaleManage/resale/buy", params).then((res) => {
    console.log('res1', res.data)

    if (res.data.success) {
      console.log(res.data)
      open('https://www.baidu.com?a=asdasdasdasdasdasddddddddddddd', 'chrome')
    }
    else {
      setTimeout(() => {
        getList()

      }, 1000)
    }

  }).catch(e => {
    setTimeout(() => {
      getList()

    }, 1000)
  })


}

// let created = () => {
//   instance.post("user/userorder", {
//     "status": 0,
//     "page": 1,
//     "token": token
//   }).then((res) => {
//     console.log('res2', res)
//   });
// }

getList()

app.listen(3000);