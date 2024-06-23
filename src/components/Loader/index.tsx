import { Box, CircularProgress, TableCell, TableRow } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={64} disableShrink thickness={3} />
    </Box>
  );
}

export default Loader;

export const TableLoader = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} style={{ textAlign: "center" }}>
        <CircularProgress />
      </TableCell>
    </TableRow>
  );
};
