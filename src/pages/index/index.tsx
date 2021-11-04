import { Component } from 'react'
import { View, Button } from '@tarojs/components'
import { observer, inject } from 'mobx-react'

import Taro from '@tarojs/taro'
import './index.less'

type PageStateProps = {
  store: {
    counterStore: {
      counter: number,
      increment: Function,
      decrement: Function,
      incrementAsync: Function
    }
  }
}

interface Index {
  props: PageStateProps;
}

@inject('store')
@observer
class Index extends Component {
	state = {
		rewordText: ''
	}

	componentDidMount() {
		this.renderReword()
	}
	
	clockIn = () => {
		Taro.request({
			url: 'http://localhost:3000/clock', //仅为示例，并非真实的接口地址
			method: 'POST',
			success: function (res) {
				console.log(res)
			}
		})
	}

	renderReword = () => {
		let text = ` \n `
		setInterval(() => {
			const currTime = new Date()
			const currYear = currTime.getFullYear()
			const currMonth = currTime.getMonth() + 1
			const currDay = currTime.getDate()
			const five = new Date(`${currYear}-${currMonth}-${currDay} 8:30:00`)
			const difference = currTime.getTime() - five.getTime()
			const hour = Math.floor((difference / 1000) / 3600)
			const minute = Math.floor((difference / 1000 / 60) % 60)
			const second = Math.floor((difference / 1000) % 60)
			const rewardPerSecond = 500 / 8 / 3600
			const rewardTotal = (rewardPerSecond * difference / 1000).toFixed(2)
			text = `你已加班:${hour}小时${minute}分${second}秒, \n 已赚取${rewardTotal}元报酬`
			this.setState({
				rewordText: text
			})
		}, 1000)
		return text
	};

	login = async () => {
		const { code } = await Taro.login()
		Taro.request({
			url: 'http://localhost:3000/user/login',
			method: 'POST',
			data: {
				code,
			},
			success: function (res) {
				console.log(res)
				Taro.getUserInfo()
			}
		})
	}

  render () {
    return (
      <View className='index'>
				{/* <Text className="rewordText">{this.state.rewordText}</Text> */}
        {/* <View className="greenStatus" onClick={this.clockIn}>立即打卡</View> */}
				<Button openType="getAuthorize" onClick={this.login}>登陆</Button>
      </View>
    )
  }
}

export default Index
