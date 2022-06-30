import { useState } from "react";
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useClientContext } from "context/Client";

export default function ComponentDemo() {
  const [value, setValue] = useState("");
  const onChange = e => {
    setValue(e.target.value);
  };

  const { captchaExecute } = useClientContext();
  const [message, setMessage] = useState("");

  const onSubmit = async e => {
    e.preventDefault();
    try {
      captchaExecute("/api/message", { Hello: value }, res => {
        setMessage(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  return (
    <Box>
      <TextField label="Hello" variant="outlined" value={value} onChange={onChange} />
      <Button onClick={onSubmit}>Submit</Button>

      <Dialog onClose={handleClose} open={Boolean(message)}>
        <DialogTitle>Message from backend</DialogTitle>
        <DialogContent>{message}</DialogContent>
      </Dialog>
    </Box>
  );
}
