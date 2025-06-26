import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'reactstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import {
    Container, Row, Col, FormGroup, Label, Input, Button, Table, Alert,
    CardBody
  } from 'reactstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
export default function Invoice()
{
    const [invoices, setInvoices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editId,setEditId]=useState(null);
  const [editTitle,setEditTitle]=useState('')
  const [editDescription,setEditDescription]=useState('')
  const [editAmount,setEditAmount]=useState('')
  const [editDueDate,setEditDueDate]=useState('')

  const apiUrl = 'http://localhost:4100/invoices';
  const [billTo, setBillTo] = useState({ name: '', address: '', phone: '', gst: '', email: '' });
  const [shipTo, setShipTo] = useState({ name: '', address: '', phone: '', gst: '', email: '' });
  const [sellerInfo, setSellerInfo] = useState({ name: '', address: '', phone: '', gst: '', email: '' });

  const [products, setProducts] = useState([]);
  const [productDetails,setProductDetails]=useState('')
  const[quantity,setQuantity]=useState('')
  const[unitPrice,setUnitPrice]=useState(0)
  const [gst]=useState(0.18)
  const [grandTotal,setGrandTotal]=useState(0)
  useEffect(() => {
    fetchInvoices();
   
  }, []);
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(apiUrl);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  const handleEdit=(invoice)=>{
      setEditId(invoice._id)
      setEditTitle(invoice.title)
      setEditDescription(invoice.description);
      setEditAmount(invoice.amount.toString())
      setEditDueDate(invoice.dueDate)
  }
  const handleDelete=async(id)=>{
     if(window.confirm("are you sure want to delete"))
      try {
        await axios.delete(`${apiUrl}/${id}`);
        setInvoices(invoices.filter(invoice=>invoice._id!==id))
      } catch (error) {
        setError("unable to delete invoice")
      }
  }
  const handleUpdate=async()=>{
    setError('')
    setMessage('')
    const numericAmount=parseFloat(editAmount)
    if(editTitle.trim()&& editDescription.trim() && !isNaN(numericAmount) && editDueDate.trim()){
      try {
          const response=await axios.put(`${apiUrl}/${editId}`,{
            title:editTitle,
            description:editDescription,
            amount:numericAmount,
            dueDate:editDueDate
          });
          const updateInvoices=invoices.map(invoice=>invoice._id===editId?response.data:invoice)
          setInvoices(updateInvoices)
          setEditId(null);
          setEditTitle('');
          setEditDescription('');
          setEditAmount('')
          setEditDueDate('')
          setMessage("Invoice updated successfully")
      } catch (error) {
        setError("unable to update invoice")
      }
    }
  }
  const handleSubmit=async()=>{
    setError('');
    setMessage('');
    const numericAmount=parseFloat(amount)
    if(title.trim()&& description.trim() && !isNaN(numericAmount) && dueDate.trim()){
      try {
          const response=await axios.post(apiUrl,{
            title, 
            description,
            amount:numericAmount,
            dueDate
          });
       
          setInvoices([...invoices,response.data])
         
          setEditTitle('');
          setEditDescription('');
          setEditAmount('')
          setEditDueDate('')
          setMessage("Invoice updated successfully")
      } catch (error) {
        setError("unable to update invoice")
      }
    }
  }
  const addProduct = () => {
    if (productDetails.trim() && quantity > 0 && unitPrice > 0) {
      const total = quantity * unitPrice;
      const gstAmount = total * gst;
      setProducts([...products, { details: productDetails, quantity, unitPrice, total, gst: gstAmount }]);
      setProductDetails('');
      setQuantity(1);
      setUnitPrice(0);
    }
  };
const handleQuantityChange=(index,newQuantity)=>{
     const updatedProducts=[...products]
     const product=updatedProducts[index]
     product.quantity=newQuantity;
     product.total=newQuantity*product.unitPrice;
     product.gst=product.total*gst;
     setProducts(updatedProducts)

}
const handleRemoveProduct=(index)=>{
  const updatedProducts=products.filter((_,i)=>i!==index)
  setProducts(updatedProducts)
}
const calculateGrandToatl = useCallback(() => {
  return products.reduce((total, product) => total + product.total + product.gst, 0).toFixed(2);
}, [products]);

useEffect(() => {
  setGrandTotal(calculateGrandToatl());
}, [products, calculateGrandToatl]);

const handleDownloadPdf = () => {
  const doc = new jsPDF();
  const backgroundColor = [240, 240, 240];
  const x = 12;
  const y = 13;
  const width = 180;
  const height = 110;

  doc.setFillColor(...backgroundColor);
  doc.rect(x, y, width, height, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, width, height);
  
  // Add Seller Information
  doc.setFontSize(16);
  doc.text('SELLER INFORMATION:', 14, 20);
  doc.setFontSize(12);
  doc.text(`Name: ${sellerInfo.name}`, 14, 30);
  doc.text(`Address: ${sellerInfo.address}`, 14, 40);
  doc.text(`Phone: ${sellerInfo.phone}`, 14, 50);
  doc.text(`GST: ${sellerInfo.gst}`, 14, 60);
  doc.text(`Email: ${sellerInfo.email}`, 14, 70);
  
  doc.setFontSize(16);
  doc.text('BILL TO:', 14, 90);
  doc.setFontSize(12);
  doc.text(`Name: ${billTo.name}`, 14, 100);
  doc.text(`Address: ${billTo.address}`, 14, 110);
  doc.text(`Phone Number: ${billTo.phone}`, 14, 120);
  doc.text(`GST Number: ${billTo.gst}`, 14, 130);
  doc.text(`Email: ${billTo.email}`, 14, 140);
  
  doc.setFontSize(16);
  doc.text('SHIP TO:', 14, 150);
  doc.setFontSize(12);
  doc.text(`Name: ${shipTo.name}`, 14, 160);
  doc.text(`Address: ${shipTo.address}`, 14, 170);
  doc.text(`Phone Number: ${shipTo.phone}`, 14, 180);
  doc.text(`GST Number: ${shipTo.gst}`, 14, 190);
  doc.text(`Email: ${shipTo.email}`, 14, 200);

  const columns = [
    { header: 'S.NO', dataKey: 'serialNumber' },
    { header: 'Product Details', dataKey: 'details' },
    { header: 'Quantity', dataKey: 'quantity' },
    { header: 'Unit Price', dataKey: 'unitPrice' },
    { header: 'Total', dataKey: 'total' },
    { header: 'GST', dataKey: 'gst' },
  ];

  const data = products.map((product, index) => ({
    serialNumber: index + 1,
    details: product.details,
    quantity: product.quantity,
    unitPrice: `$${product.unitPrice.toFixed(2)}`,
    total: `$${product.total.toFixed(2)}`,
    gst: `$${product.gst.toFixed(2)}`
  }));

  doc.setFontSize(20);
  doc.text('Product List:', 14, 200);

  // ✅ Use `autoTable` as a function
  autoTable(doc, {
    columns,
    body: data,
    startY: 220,
    margin: { top: 10 },
    styles: { fontSize: 12 },
    headStyles: { fillColor: [22, 160, 133] },
    theme: 'striped',
  });

  const finalY = doc.lastAutoTable.finalY || 240;
  doc.text(`Grand Total (including GST): $${calculateGrandToatl()}`, 14, finalY + 10);
  doc.save('invoice.pdf');
};

    
    return(
        <div style={{ background: 'linear-gradient(135deg, #c9d6ff 0%, #e2e2e2 100%)', minHeight: '100vh', padding: '40px 2rem', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif' }}>
             <Container style={{ maxWidth: '1200px', paddingLeft: '2rem', paddingRight: '2rem', margin: '0 auto' }}>
      <Row className="mb-4" style={{ justifyContent: 'center', gap: '24px' }}>
        <Col>
          <div className="d-flex flex-column align-items-center justify-content-center mb-3">
            <span style={{ fontSize: '3.5rem', color: '#6c63ff', marginBottom: '0.5rem' }}>
              <i className="fa fa-file-invoice-dollar"></i>
            </span>
            <h1 className="mb-1" style={{ fontWeight: 800, color: '#4b3c91', letterSpacing: '1px' }}>Invoice Generator</h1>
            <p className="lead" style={{ color: '#6c63ff', fontSize: '1.15rem', marginBottom: 0 }}>
              Manage your invoices and products with ease.
            </p>
          </div>
          <hr style={{ borderTop: '2px solid #e3f2fd', margin: '1.5rem 0 0.5rem 0' }} />
        </Col>
      </Row>
      <Row style={{ justifyContent: 'center', gap: '24px', alignItems: 'stretch', flexWrap: 'nowrap' }}>
        <Col md={4} className="mb-4" style={{ minWidth: 340 }}>
          <Card className="shadow-sm border-0 p-4 h-100" style={{ borderRadius: '1.25rem', background: '#fff', boxShadow: '0 4px 24px rgba(76, 68, 182, 0.08)' }}>
            <Table bordered>
              <thead>
                <tr style={{ minHeight: '48px', height: '48px', background: '#f3f0ff' }}>
                  <td colSpan={2} style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#4b3c91', letterSpacing: '1px', borderRadius: '1rem 1rem 0 0' }}>BILL TO :</td>
                </tr>
              </thead>
              <tbody>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Buyer's Name</td>
                  <td style={{ padding: '10px 14px' }}><Input type='text' style={{ fontSize: '1rem', padding: '6px 10px' }} value={billTo.name} onChange={(e) => setBillTo({ ...billTo, name: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Address</td>
                  <td style={{ padding: '10px 14px' }}><Input type="textarea" style={{ fontSize: '1rem', padding: '6px 10px' }} value={billTo.address} onChange={(e) => setBillTo({ ...billTo, address: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Phone Number</td>
                  <td style={{ padding: '10px 14px' }}><Input type='text' style={{ fontSize: '1rem', padding: '6px 10px' }} value={billTo.phone} onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>GST Number</td>
                  <td style={{ padding: '10px 14px' }}><Input style={{ fontSize: '1rem', padding: '6px 10px' }} value={billTo.gst} onChange={(e) => setBillTo({ ...billTo, gst: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Email</td>
                  <td style={{ padding: '10px 14px' }}><Input type='email' style={{ fontSize: '1rem', padding: '6px 10px' }} value={billTo.email} onChange={(e) => setBillTo({ ...billTo, email: e.target.value })} /></td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={4} className="mb-4" style={{ minWidth: 340 }}>
          <Card className="shadow-sm border-0 p-4 h-100" style={{ borderRadius: '1.25rem', background: '#fff', boxShadow: '0 4px 24px rgba(76, 68, 182, 0.08)' }}>
            <Table bordered>
              <thead>
                <tr style={{ minHeight: '48px', height: '48px', background: '#f3f0ff' }}>
                  <td colSpan={2} style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#4b3c91', letterSpacing: '1px', borderRadius: '1rem 1rem 0 0' }}>SHIP TO :</td>
                </tr>
              </thead>
              <tbody>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Buyer's Name</td>
                  <td style={{ padding: '10px 14px' }}><Input type='text' style={{ fontSize: '1rem', padding: '6px 10px' }} value={shipTo.name} onChange={(e) => setShipTo({ ...shipTo, name: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Address</td>
                  <td style={{ padding: '10px 14px' }}><Input type="textarea" style={{ fontSize: '1rem', padding: '6px 10px' }} value={shipTo.address} onChange={(e) => setShipTo({ ...shipTo, address: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Phone Number</td>
                  <td style={{ padding: '10px 14px' }}><Input type='text' style={{ fontSize: '1rem', padding: '6px 10px' }} value={shipTo.phone} onChange={(e) => setShipTo({ ...shipTo, phone: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>GST Number</td>
                  <td style={{ padding: '10px 14px' }}><Input style={{ fontSize: '1rem', padding: '6px 10px' }} value={shipTo.gst} onChange={(e) => setShipTo({ ...shipTo, gst: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Email</td>
                  <td style={{ padding: '10px 14px' }}><Input type='email' style={{ fontSize: '1rem', padding: '6px 10px' }} value={shipTo.email} onChange={(e) => setShipTo({ ...shipTo, email: e.target.value })} /></td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={4} className="mb-4" style={{ minWidth: 340 }}>
          <Card className="shadow-sm border-0 p-4 h-100" style={{ borderRadius: '1.25rem', background: '#f8f3ff', boxShadow: '0 4px 24px rgba(76, 68, 182, 0.08)' }}>
            <Table bordered>
              <thead>
                <tr style={{ minHeight: '48px', height: '48px', background: '#f3f0ff' }}>
                  <td colSpan={2} style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#4b3c91', letterSpacing: '1px', borderRadius: '1rem 1rem 0 0' }}>SELLER :</td>
                </tr>
              </thead>
              <tbody>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', width: '40%', padding: '10px 14px', background: '#f8f8ff' }}>Seller Name</td>
                  <td style={{ padding: '10px 14px' }}><Input type='text' style={{ fontSize: '1rem', padding: '6px 10px' }} value={sellerInfo.name} onChange={(e) => setSellerInfo({ ...sellerInfo, name: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Address</td>
                  <td style={{ padding: '10px 14px' }}><Input type="textarea" style={{ fontSize: '1rem', padding: '6px 10px' }} value={sellerInfo.address} onChange={(e) => setSellerInfo({ ...sellerInfo, address: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Phone Number</td>
                  <td style={{ padding: '10px 14px' }}><Input type='text' style={{ fontSize: '1rem', padding: '6px 10px' }} value={sellerInfo.phone} onChange={(e) => setSellerInfo({ ...sellerInfo, phone: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>GST Number</td>
                  <td style={{ padding: '10px 14px' }}><Input style={{ fontSize: '1rem', padding: '6px 10px' }} value={sellerInfo.gst} onChange={(e) => setSellerInfo({ ...sellerInfo, gst: e.target.value })} /></td>
                </tr>
                <tr style={{ minHeight: '48px', height: '48px', verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 500, fontSize: '1rem', padding: '10px 14px', background: '#f8f8ff' }}>Email</td>
                  <td style={{ padding: '10px 14px' }}><Input type='email' style={{ fontSize: '1rem', padding: '6px 10px' }} value={sellerInfo.email} onChange={(e) => setSellerInfo({ ...sellerInfo, email: e.target.value })} /></td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0 p-4" style={{ borderRadius: '1rem', background: '#fff' }}>
            <FormGroup>
              <h3>{editId ? 'Edit Invoice' : 'Add Invoice'}</h3>
              {message && <Alert color="success">{message}</Alert>}
              {error && <Alert color="danger">{error}</Alert>}
              <Label for="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Title"
                value={editId ? editTitle : title}
                onChange={(e) => editId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
              />
              <Label for="description" className="mt-2">Description</Label>
              <Input
                type="text"
                id="description"
                placeholder="Description"
                value={editId ? editDescription : description}
                onChange={(e) => editId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
              />
              <Label for="amount" className="mt-2">Amount</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Amount"
                value={editId ? editAmount : amount}
                onChange={(e) => editId ? setEditAmount(e.target.value) : setAmount(e.target.value)}
              />
              <Label for="dueDate" className="mt-2">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                placeholder="Due Date"
                value={editId ? editDueDate : dueDate}
                onChange={(e) => editId ? setEditDueDate(e.target.value) : setDueDate(e.target.value)}
              />
              {editId ? (
                <div className="mt-3">
                  <Button color="primary" onClick={handleUpdate}>Update</Button>{' '} 
                  <Button color="secondary"  className="ml-2">Cancel</Button>
                </div>
              ) : (
                <Button color="success" onClick={handleSubmit} className="mt-3">Submit</Button>
              )}
            </FormGroup>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0 p-4" style={{ borderRadius: '1rem', background: '#fff' }}>
            <h3>Invoices</h3>
            <Table striped>
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={invoice._id}>
                    <td>{index + 1}</td>
                    <td>{invoice.title}</td>
                    <td>{invoice.description}</td>
                    <td>${invoice.amount}</td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td>
                      <Button color="warning" onClick={() => handleEdit(invoice)} className="mr-3">Edit</Button>{' '}
                      <Button color="danger" onClick={() => handleDelete(invoice._id)} className="mr-3">Delete</Button>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 p-4" style={{ borderRadius: '1rem', background: '#fff' }}>
            <FormGroup>
              <h3>Add Product</h3>
              <Label for="productDetails">Product Details</Label>
              <Input
                type="text"
                id="productDetails"
                placeholder="Product Details"
                value={productDetails}
                onChange={(e)=>setProductDetails(e.target.value)}
              />
              <Label for="quantity" className="mt-2">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="Quantity"
                value={quantity}
                onChange={(e)=>setQuantity (Number(e.target.value))}
              />
              <Label for="unitPrice" className="mt-2">Unit Price</Label>
              <Input
                type="number"
                id="unitPrice"
                placeholder="Unit Price"
               value={unitPrice}
               onChange={(e)=>setUnitPrice(Number(e.target.value))}
              />
              <Button color="primary"  className="mt-3" onClick={addProduct}>Add Product</Button>
            </FormGroup>
          </Card>
        </Col>
        <Col md={8} className="mb-4">
          <Card className="shadow-sm border-0 p-4" style={{ borderRadius: '1rem', background: '#fff' }}>
            <Table striped>
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Product Details</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>GST</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.details}</td>
                    <td>
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e)=>handleQuantityChange(index,Number(e.target.value))}
                        min="1"
                      /> 
                    </td>
                    <td>${product.unitPrice.toFixed(2)}</td>
                    <td>${product.total.toFixed(2)}</td>
                    <td>${product.gst.toFixed(2)}</td>
                    <td>
                      <Button color="danger"  onClick={()=>handleRemoveProduct(index)} >Remove</Button>
                    </td>
                  </tr>
                ))}     
                <tr>
                  <td colSpan="5" className="text-right">Grand Total (including GST)</td>
                  <td>${grandTotal}</td>
                  <td></td>
                </tr>
              </tbody> 
            </Table> 
          </Card>
          <Button color="primary"  className="mt-3" style={{ borderRadius: '2rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} onClick={handleDownloadPdf}>
            <i className="fa fa-download me-2"></i>Download Products PDF
          </Button>
        </Col>
      </Row>
    </Container>
  </div>
    )
}