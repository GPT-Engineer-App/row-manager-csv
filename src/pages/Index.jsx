import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import Papa from "papaparse";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        },
      });
    }
  };

  const handleAddRow = () => {
    setData([...data, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited_data.csv";
    link.click();
  };

  const handleInputChange = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">CSV Upload, Edit, and Download Tool</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button leftIcon={<FaPlus />} onClick={handleAddRow} colorScheme="teal">
          Add Row
        </Button>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {headers.map((header, index) => (
                <Th key={index}>{header}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <Td key={colIndex}>
                    <Input
                      value={row[header] || ""}
                      onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                    />
                  </Td>
                ))}
                <Td>
                  <IconButton
                    aria-label="Remove Row"
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleRemoveRow(rowIndex)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button leftIcon={<FaDownload />} onClick={handleDownload} colorScheme="blue">
          Download CSV
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;