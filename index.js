import React, { PureComponent } from 'react';
import { message, Button, InputNumber } from 'antd';
import PDF from 'react-pdf-js';
import style from './index.less'


class PDFViewer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      pdfTest:null,
      turnPageNumber:null,
    }
  }

  componentDidMount(){
    const PDFViewerWidth = document.getElementById('PDFViewer').offsetWidth;
    if(PDFViewerWidth < 650){
      throw Error('PDFViewer width must bigger than 650px')
    }
  }

  onDocumentComplete = (numPages) => {
    this.setState({
      numPages,
      pageNumber: 1,
    });
  }

  onPageNumberInputChange =(value)=>{
    this.setState({
      turnPageNumber:value,
    })
  }

  handleButtonOnChange = e =>{
    if (e.currentTarget.files.length === 0) return;
    const url = window.URL.createObjectURL(e.currentTarget.files[0]);
    this.setState({
      pdfTest: {
        key:url,
        file:url,
      },
    })
  }

  handleTurnPage = e =>{
    const { pageNumber, numPages, turnPageNumber } = this.state;
    if(!numPages){
      message.warning('请先选择PDF文件');
      return;
    }
    let newPageNumber = pageNumber;
    switch (e.target.id) {
      case 'pageUp':
        newPageNumber -= 1;
        if(newPageNumber <= 0){
          message.warning('已经是第一页');
          return;
        }
        break;
      case 'pageDown':
        newPageNumber += 1;
        if(newPageNumber > numPages){
          message.warning('已经是最后一页');
          return;
        }
        break;
      case 'numberPage':
        if(!turnPageNumber){
          message.warning('请先输入数字');
          return;
        }else if(turnPageNumber <= 0||turnPageNumber > numPages){
          message.warning('请输入在页面范围内的数字');
          return;
        }
        newPageNumber = turnPageNumber;
        break;
      default:
        break;
    }
    this.setState({
      pageNumber:newPageNumber,
    })
  }

  createPDF = () =>{
    const { pageNumber, numPages, pdfTest } = this.state;
    if(!pdfTest) return;
    return(
      <div>
        <div className={style.pdfContainer}>
          <PDF
            key={pdfTest.key}
            file={pdfTest.file}
            onDocumentComplete={this.onDocumentComplete}
            page={pageNumber}
            className={style.pdfView}
            width='300px'
          />
        </div>
        <p style={{float:'right'}}>第 {pageNumber} 页  共 {numPages} 页</p>
      </div>
      )
  }

  render() {
    return (
      <div id='PDFViewer'>
        <input id='id' type="file" style={{width:'200px',height:'35px'}} accept=".pdf" onChange={this.handleButtonOnChange} />
        <div style={{float:'right'}}>
          <InputNumber onChange={this.onPageNumberInputChange} style={{width:'150px'}} placeholder='输入需要跳转的页' />
          <Button onClick={this.handleTurnPage} id="numberPage">确认跳转</Button>
          <Button onClick={this.handleTurnPage} id="pageUp">上一页</Button>
          <Button onClick={this.handleTurnPage} id="pageDown">下一页</Button>
        </div>
        {this.createPDF()}
      </div>
    );
  }
}

export default PDFViewer;


