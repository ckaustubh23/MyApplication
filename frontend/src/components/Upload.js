import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const FileInput = styled.input`
  display: block;
  margin: 10px auto;
`;

const Button = styled.button`
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

function Upload() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/file/files');
      setFileData(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching file data');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      fetchFiles(); // Refresh the file data after upload
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Filename',
        accessor: 'filename',
      },
      {
        Header: 'File Path',
        accessor: 'filepath',
      },
      {
        Header: 'Upload Date',
        accessor: 'upload_date',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: fileData });

  return (
    <Container>
      <Title>Upload File</Title>
      <FileInput type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload</Button>
      <Title>Uploaded Files</Title>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </Tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default Upload;
