import { MenuItem } from "@mui/material";
import Select from '@mui/material/Select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';


export default function Filter({filters, onChange, show, onHide, tagList}) {


    return(
        <div className="filter-select">
        <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Filters
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
            <Row>
                <Col xs={4} md={4}>
        <h4>Priority:</h4>
        <p>
          <Select fullWidth value={filters.priority} onChange={e=>{onChange({    ...filters, priority: e.target.value}); console.log("filter prio change", e.target.value)}}
                >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="0">Priority 0</MenuItem>
                <MenuItem value="1">Priority 1</MenuItem>
                <MenuItem value="2">Priority 2</MenuItem>
                <MenuItem value="3">Priority 3</MenuItem>
                <MenuItem value="4">Priority 4</MenuItem>
                
            </Select>
        </p>
        </Col>
        <Col xs={4} md={4}>
        <h4>Contains Text:</h4>
        <OutlinedInput placeholder="Enter text..." value={filters.search} onChange={e=>{onChange({...filters, search:e.target.value}); console.log("filter search change", e.target.value)}}>

        </OutlinedInput>
        </Col>
        <Col xs={4} md={4}>
        <h4>Has Tags:</h4>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          fullWidth
          onChange={e=> {onChange({...filters, tags: e.target.value}); console.log("filter tag change", e.target.value)}}
          value={filters.tags || []} // catch incase user has no tags.
          input={<OutlinedInput label="Tags" />}
        >
          {tagList.map((tag) => (
            <MenuItem
              key={tag.tag_id}
              value={String(tag.tag_id)} // filter is running off checking strings - unless this is cast as a string, filter doesn't work.
            >
              {tag.tag_name}
            </MenuItem>
          ))}
        </Select>

        </Col>
        </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    </div>
    )}