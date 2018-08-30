import React from 'react';
import {SERVER_URL} from './appConfig';
import Playlist from './Playlist';
class Downloader extends React.Component{
  constructor(){
    super();
    this.state={
      url:'',
      fetched:false,
      vId:'',
      vQuality:'medium',
      subtitle:false,
      playlist:[
        {
          error:false,
          vId:'jV3xxOoWe-4'
        },
        { error:true,
          vId:'M-P4QBt-FWw'
        }  
      ]
    }
    this.handleChange=this.handleChange.bind(this);
    this.onDownload=this.onDownload.bind(this);
  }

  handleChange(e){
    
    switch(e.target.name){
      case 'urlInput':{
        this.setState({url:e.target.value});
        break;
      }
      case 'fetchBtn':{
        let urlParts = this.state.url.split('?v=')
        let vId = urlParts.length > 1 ? urlParts[1] : this.state.url
        this.setState({fetched:true,vId});
        break;
      }
      case 'subInput':{
        this.setState({subtitle:e.target.checked});
        break;
      }
      case 'videoQuality':{
        this.setState({vQuality:e.target.value});
        break;
      }
      default :{
        console.log('make a case for selection');
        break;
      }
    }
  }

  onDownload(e){
    
    if(this.state.fetched){
      
      console.log('downloading');
      
      let indx = this.state.playlist.map( v=> v.vId).indexOf(this.state.vId);
      let newPlaylist=[...this.state.playlist];

      if(indx===-1){
        newPlaylist=[...newPlaylist,{error:false,vId:this.state.vId}];
      }else{
        newPlaylist=[...newPlaylist.slice(0,indx),{error:false,vId:this.state.vId},...newPlaylist.slice(indx+1)];
      }
      
      this.setState({fetched:false,playlist:newPlaylist});
      
      fetch(SERVER_URL+'/download',{
        method:"POST",
        mode:"cors",
        credentials:"omit",
        headers:{
          "Content-type":"application/json; charset=utf-8"
        },
        body:JSON.stringify({
          vId:this.state.vId,
          vQuality:this.state.vQuality,
          subtitle:this.state.subtitle
        })
      })
      .then(res=>res.json())
      .then(res=>{
        console.log(res)
        if(res.error){
          let indx = this.state.playlist.map( v=> v.vId).indexOf(res.vInfo.vId) ;
          let newPlaylist = [...this.state.playlist];
          newPlaylist=[...newPlaylist.slice(0,indx),{error:true,vId:res.vInfo.vId,...newPlaylist.slice(indx+1)}];
          this.setState({playlist:newPlaylist});
        }
      });
    
    }

  }

  render(){
    return(
      <div>
        <h1 className="heading" >Ydownloader for downloading videos from youtube</h1>
        <input className="urlInput" name="urlInput" onChange={this.handleChange} placeholder="enter the url of video" type="url" value={this.state.url} /> 
        
        { (!!(this.state.ulr)) && 
          <button className="btn btnClear" onClick={this.handleChange} name="clearBtn" > Clear </button>
        }
        
        <button className="btn btnFetch" onClick={this.handleChange} name="fetchBtn" > Fetch </button>
        {
          this.state.vId &&
          <iframe width="420" height="315" src={ "https://www.youtube.com/embed/"+ this.state.vId}></iframe>
        }
        
        
        <label htmlFor="qualitySelect" >Select Quality</label>
        <select name="videoQuality" id="qualitySelect" defaultValue="medium"  onChange={this.handleChange} >
          <option value="audio" >Audio Only</option> 
          <option value="low">Low</option>
          <option value="medium" >Medium</option>
          <option value="high">High</option>
        </select>
        
        <label htmlFor="subInput" >With Subtitle</label>
        <input type="checkbox" id="subInput" name="subInput" onChange={this.handleChange} />

        <button className="btn btnDownload" onClick={this.onDownload} name="downloadBtn" > Download </button>

        <Playlist state={this.state.playlist} />

      </div>
    )
  }

}

export default Downloader;