const Peer = require('simple-peer')
const io = require('socket.io-client')
const socket = io('http://127.0.0.1:3000')
var getUserMedia = require('getusermedia')
const video = document.querySelector('video')
const client = {}
var browserStream

function getUserMediaStream () {
//   var stream
  getUserMedia({ video: true, audio: true }, function (err, stream) {
    if (err) {
      console.log('failed to get media access', err)
      document.write(err)
    } else {
      browserStream = stream
      console.log('successfully fetched user media stream', stream)
      //   this.stream = stream
      socket.emit('NewClient')
      video.srcObject = stream
      video.play()
    }
  })
}

// used to start a peer
function initPeer (type) {
  const peer = new Peer({ initiator: (type === 'init'), stream: browserStream, trickle: false })
  peer.on('stream', function (stream) {
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
  const peer = initPeer('init', browserStream)
  peer.on('signal', function (data) {
    if (!client.gotAnswer) {
      socket.emit('offer', data)
    }
  })
  client.peer = peer
}

// when we get an offer from another client and we want to send the answer
function frontAnswer (offer) {
  const peer = initPeer('notInit')
  peer.on('signal', function (data) {
    socket.emit('answer', data)
  })
  peer.signal(offer)
}

function signalAnswer (answer) {
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
  console.log('connected to socket')
})
socket.on('BackOffer', frontAnswer)
socket.on('BackAnswer', signalAnswer)
socket.on('SessionActive', sessionActive)
socket.on('CreatePeer', makePeer)

window.getUserMediaStream = getUserMediaStream
