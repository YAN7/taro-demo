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
		// rewordText: ''
		id: '',
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
		let rewordText = ` \n `
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
			rewordText = `你已加班:${hour}小时${minute}分${second}秒, \n 已赚取${rewardTotal}元报酬`
			this.setState({
				// eslint-disable-next-line react/no-unused-state
				rewordText,
			})
		}, 1000)
		return rewordText
	};

	login = async () => {
		const { code } = await Taro.login()
		Taro.request({
			url: 'http://localhost:3000/user/login',
			method: 'POST',
			data: {
				code,
			},
			success: (res: any) => {
				console.log('res', res)
				this.setState({
					id: res.data.id,
				})
				if (!res.data.id) {
					Taro.showModal({
						title: '提示',
						content: '尚未授权,请进行授权,请点击登录按钮授权',
					})
				}
			}
		})
	}


	getUserInfo = (e: any) => {
		// console.log('e', e)
		Taro.request({
			url: 'http://localhost:3000/user',
			method: 'POST',
			data: {
				id: this.state.id,
				...e.detail.userInfo,
			},
			success: (res) => {
				// if (res.code)
				console.log('res')
			}
		})
	}

  render () {
    return (
      <View className='index'>
				{/* <Text className="rewordText">{this.state.rewordText}</Text> */}
        {/* <View className="greenStatus" onClick={this.clockIn}>立即打卡</View> */}
				<Button openType='getUserInfo' onGetUserInfo={this.getUserInfo}>登陆</Button>
				<Button onClick={this.login}>检测登录状态</Button>
      </View>
    )
  }
}

export default Index
