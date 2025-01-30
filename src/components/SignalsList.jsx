import { useEffect, useState } from "react";
import { Paper, Typography, Button, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: "transparent",
  border: `1px solid ${theme.palette.grey[900]}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 20px ${theme.palette.primary.main}15`,
  },
}));

const RiskChip = styled(Chip)(({ theme, risk }) => ({
  backgroundColor:
    risk <= 3
      ? theme.palette.success.main
      : risk <= 6
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "24px",
}));

const WalletButton = styled(WalletMultiButton)(({ theme }) => ({
  backgroundColor: "#2563EB",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  width: "100%",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "#1D4ED8",
  },
  "& .wallet-adapter-button-trigger": {
    background: "none",
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#000",
  [theme.breakpoints.up("md")]: {
    position: "fixed",
    right: 0,
    top: 0,
    width: "380px",
    height: "100vh",
    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
  },
}));

const TopSection = styled(Box)(({ theme }) => ({
  padding: "12px 24px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
}));

const getRiskColor = (risk) => {
  if (risk <= 3) return "#4ADE80"; // Green for low risk
  if (risk <= 6) return "#F59E0B"; // Yellow for medium risk
  return "#EF4444"; // Red for high risk
};

const SignalsList = ({ timeFrame }) => {
  const [signals, setSignals] = useState([]);
  const theme = useTheme();
  const { publicKey, connected } = useWallet();

  // Mock data - replace with your actual API call
  useEffect(() => {
    const mockSignals = [
      {
        symbol: "BTC",
        risk: 4,
        marketCap: "$1.2B",
        time: "15m ago",
        price: "$102000.80",
      },
      {
        symbol: "ETH",
        risk: 3,
        marketCap: "$800M",
        time: "1h ago",
        price: "$3200.00",
      },
      {
        symbol: "SOL",
        risk: 5,
        marketCap: "$400M",
        time: "2h ago",
        price: "$240.00",
      },
    ];
    setSignals(mockSignals);
  }, [timeFrame]);

  return (
    <SidebarContainer>
      <TopSection>
        <WalletButton>
          {connected ? (
            <span>
              {publicKey?.toString().slice(0, 4)}...
              {publicKey?.toString().slice(-4)}
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </WalletButton>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2563EB",
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#1D4ED8",
            },
          }}
        >
          Premium
        </Button>
      </TopSection>

      <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          Latest Buy Signals
        </Typography>

        {/* Signals Cards */}
        <Box sx={{ mb: 4 }}>
          {signals.map((signal, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                width: "100%",
                backgroundColor: "#003300",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  ${signal.symbol}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {signal.time}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    mt: 1,
                  }}
                >
                  {signal.price}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mt: 0.5,
                  }}
                >
                  Risk: <strong>{signal.risk}/100</strong> Market Cap:{" "}
                  <strong>{signal.marketCap}</strong>
                </Typography>
              </Box>

              {/* Right Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  width="16"
                  height="16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Premium Section */}
        <Box
          sx={{
            mt: "auto",
            backgroundColor: "#19202F",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 24,
                height: 24,
                backgroundColor: "#2563EB",
                borderRadius: "50%",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h11M9 21V3m9 4l3 3-3 3"
                />
              </svg>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#FFFFFF" }}>
              Premium Signals
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
            Get early access to all buy signals and advanced analytics
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
            $49
            <Typography
              component="span"
              variant="body2"
              sx={{ color: "#9CA3AF" }}
            >
              /month
            </Typography>
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#2563EB",
              color: "white",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#1D4ED8",
              },
            }}
          >
            Subscribe Now
          </Button>
        </Box>
      </Box>
    </SidebarContainer>
  );
};

export default SignalsList;
