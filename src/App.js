import "./App.css";
import {
  Button,
  Grid,
  Typography,
  Paper,
  Container,
  FormGroup,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import "moment/locale/ru";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
moment.locale("ru");
function App() {
  const [tNum, setTNum] = useState("");
  const [tText, setTText] = useState("");
  const [tError, setTError] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);
  const addPlus = (n) => (n > 0 ? "+" + String(n) : String(n));

  const [transactions, setTransactions] = useState(() => {
    var data = JSON.parse(window.localStorage.getItem("transactions"));
    if (data === null) {
      return [];
    }
    return data;
  });
  const [balance, setBalance] = useState(
    transactions
      .map((t) => (t.exists ? t.amount : 0))
      .reduce((a, b) => a + b, 0)
  );

  const newTransaction = (name, amount) => {
    setTransactions((transactions) => {
      const newState = transactions;
      newState.push({
        name,
        amount,
        date: moment(),
        id: Object.keys(transactions).length,
        exists: true,
      });
      return newState;
    });
  };
  const handleAddButtonPressed = () => {
    if (tText === "" || tNum === "") {
      setTError(true);
      return;
    }
    newTransaction(tText, Number(tNum));
    setTError(false);
    setBalance(balance + Number(tNum));
    setTText("");
    setTNum("");
  };

  const handleDeleteButtonPressed = (id, amount) => {
    setBalance((balance) => balance - amount);
    setTransactions((transactions) => {
      const newState = transactions;
      newState[id].exists = false;
      return newState;
    });
    setDeletedIds((deletedIds) => {
      const newState = deletedIds;
      newState.push(id);
      return newState;
    });
  };

  const handleTime = (date) => {
    console.log(date);
    return moment(date).calendar();
  };

  const handleUndoButtonPressed = () => {
    let targetId = deletedIds[deletedIds.length - 1];
    setTransactions((transactions) => {
      const newState = transactions;
      newState[targetId].exists = true;
      return newState;
    });
    setBalance((balance) => balance + transactions[targetId].amount);
    setDeletedIds((deletedIds) => {
      const newState = deletedIds;
      newState.pop();
      return newState;
    });
  };
  window.localStorage.setItem("transactions", JSON.stringify(transactions));

  console.log(transactions);

  return (
    <div className="App">
      <Typography variant="h4" marginTop={2}>
        Расчет Доходов/Расходов
      </Typography>
      <Container maxWidth="sm">
        <div className="Balance">
          <Paper
            elevation={3}
            style={{
              marginTop: "20px",
            }}
          >
            <Typography
              variant="OVERLINE TEXT"
              style={{
                opacity: 0.7,
              }}
            >
              БАЛАНС:
            </Typography>
            <Typography
              variant="h3"
              color={balance === 0 ? "black" : balance > 0 ? "green" : "error"}
            >
              {addPlus(balance)}₽
            </Typography>
          </Paper>
        </div>
        <div
          className="Transactions"
          style={{
            marginTop: 20,
          }}
        >
          <Paper elevation={3} sx={{ minHeight: "400px", padding: "20px" }}>
            <FormGroup style={{ marginBottom: 20 }}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid item width={0.74} align="left">
                  <TextField
                    type="text"
                    label="Назначение"
                    variant="filled"
                    size="small"
                    value={tText}
                    onChange={(e) => {
                      setTText(e.target.value);
                    }}
                    sx={{ width: "100%", height: "10px" }}
                    error={tError && tText === "" ? true : false}
                  />
                </Grid>
                <Grid item width={0.25}>
                  <TextField
                    type="number"
                    variant="filled"
                    size="small"
                    value={tNum}
                    onChange={(e) => {
                      setTNum(e.target.value);
                    }}
                    label="Сумма"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₽</InputAdornment>
                      ),
                    }}
                    error={tError && tNum === "" ? true : false}
                  />
                </Grid>
              </Grid>
              <ButtonGroup>
                <Button
                  variant="contained"
                  onClick={handleAddButtonPressed}
                  style={{ width: "100%" }}
                >
                  Добавить транзакцию
                </Button>
                <Button
                  variant="contained"
                  disabled={deletedIds.length === 0 ? true : false}
                  color="error"
                  onClick={handleUndoButtonPressed}
                >
                  <UndoIcon />
                </Button>
              </ButtonGroup>
            </FormGroup>
            <Table aria-label="simple table">
              <TableBody>
                {transactions
                  .slice()
                  .reverse()
                  .map((row) =>
                    row.exists ? (
                      <TableRow
                        key={row.id}
                        className={
                          row.amount > 0
                            ? "Good Transaction"
                            : "Bad Transaction"
                        }
                        style={{
                          position: "relative",
                        }}
                        mw="sm"
                      >
                        <TableCell className="table-cell" size="small">
                          {row.name}
                        </TableCell>
                        <TableCell
                          align="right"
                          className="table-cell"
                          size="small"
                        >
                          {addPlus(row.amount)}₽
                        </TableCell>
                        <TableCell
                          align="right"
                          size="small"
                          style={{ width: "5px" }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteButtonPressed(row.id, row.amount)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Typography
                            variant="overline"
                            style={{
                              margin: 0,
                              fontSize: 9,
                              position: "absolute",
                              left: 0,
                              width: "96%",
                              padding: "0 2%",
                              bottom: "-7px",
                              textAlign: "right",
                            }}
                          >
                            {handleTime(row.date)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </Container>
    </div>
  );
}

export default App;
