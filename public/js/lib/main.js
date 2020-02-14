const Peer = require('simple-peer')
const io = require('socket.io-client')
const socket = io('/')
var getUserMedia = require('getusermedia')
const video = document.querySelector('video')
const client = {}
var browserStream

function getUserMediaStream (userData) {
//   var stream
  getUserMedia({ video: true, audio: false }, function (err, stream) {
    if (err) {
      console.log('failed to get media access', err)
      document.write(err)
    } else {
      browserStream = stream
      console.log('successfully fetched user media stream', stream)
      socket.emit('join', userData)
    }
  })
}

// used to start a peer
function initPeer (type) {
  const peer = new Peer({ initiator: (type === 'init'), stream: browserStream, trickle: false })
  console.log('init peer called for ', type)
  peer.on('stream', function (stream) {
    console.log('stream started for ', type)
    createVideo(stream)
  })
  peer.on('close', function () {
    document.getElementById('peerVideo').removeChild()
    peer.destroy()
  })
  return peer
}

// for creating a peer of type init, called when we want the peer to send the offer
function makePeer () {
  client.gotAnswer = false
  console.log('make peer called')
  const peer = initPeer('init', browserStream)
  peer.on('signal', function (data) {
    console.log('got signal from peer: ', data)
    if (!client.gotAnswer) {
      console.log('client hasnt got an answer')
      socket.emit('offer', data)
    }
  })
  client.peer = peer
}

// when we get an offer from another client and we want to send the answer
function frontAnswer (offer) {
  console.log('front answer, initating peer of type notInit', offer)
  const peer = initPeer('notInit')
  peer.on('signal', function (data) {
    console.log('signal received; data: ', data)
    socket.emit('answer', data)
  })
  peer.signal(offer)
}

function signalAnswer (answer) {
  console.log('signal answer fron be', answer)
  client.gotAnswer = true
  const peer = client.peer
  peer.signal(answer)
}

function createVideo (stream) {
  const video = document.createElement('video')
  video.id = 'peerVideo'
  video.srcObject = stream
  video.class = 'embed-responsive-item'
  document.querySelector('#peerDiv').appendChild(video)
  video.play()
}

function sessionActive () {
  document.write('chat already in session, please try again later')
}

socket.on('connect', function () {
  console.log('socket connection successful')
})
socket.on('BackOffer', frontAnswer)
socket.on('BackAnswer', signalAnswer)
socket.on('SessionActive', sessionActive)
socket.on('CreatePeer', makePeer)

socket.on('joined', function (data) {
  console.log('user has joined', data.data)
  video.srcObject = browserStream
  video.play()
})

window.getUserMediaStream = getUserMediaStream
