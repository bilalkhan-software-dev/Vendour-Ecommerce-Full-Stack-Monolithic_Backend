import {
  Avatar,
  Badge,
  badgeClasses,
  Box,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Zoom,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputBase,
  Drawer,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import styled from '@emotion/styled';
import {
  CloseRounded,
  ExpandLess,
  ExpandMore,
  StorefrontRounded,
} from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { mainCategory } from '../../../data/category/mainCategory';
import MegaMenuCategorySheet from './MegaMenuCategorySheet';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import ChatBot from '../../../component/Chatbot/GeneralChatBot';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import MobileDrawerCategorySheet from './MobileDrawerCategorySheet';
import { debounce } from 'lodash';
import { searchProducts } from '../../../redux/slice/customer/productSlice';
import type { ProductSuggestionResponse } from '../../../types/product';

// Badge Styling
const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -15px;
    right: 1px;
    background-color: red;
    color: white;
    font-size: 0.6rem;
    min-width: 18px;
    height: 18px;
  }
`;

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const { auth, cart, product } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMobileDrawerMenu, setShowMobileDrawerMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('men');

  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchFab, setShowSearchFab] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentSearch');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setShowSearchFab(scrollY > 150);

      if (searchMode && scrollY > 500) {
        setSearchMode(false);
      }

      setShowMegaMenu(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchMode]);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(
      0,
      10
    );
    setRecentSearches(updated);
    localStorage.setItem('recentSearch', JSON.stringify(updated));
  };

  // Debounced suggestion search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(searchProducts({ query }));
    }, 500),
    [dispatch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      debouncedSearch(value);
    }
  };

  // Submit search instantly
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    saveRecentSearch(searchQuery);

    await dispatch(searchProducts({ query: searchQuery }));

    
    
    
    navigate(`/products/search/${searchQuery}/searching.../result`);
    setSearchQuery('');
    setSearchMode(false);
    setShowSuggestions(false);
  };

  const filteredSuggestions = product?.searchProducts ?? [];

  // Remove recent search
  const removeSearchIndex = (idx: number) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      localStorage.setItem('recentSearch', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <Box
        sx={{ borderBottom: '1px solid #e0e0e0', zIndex: 1500 }}
        className="sticky top-0 left-0 right-0 bg-white"
      >
        <div className="flex items-center justify-between h-[70px] px-4 md:px-8 lg:px-12">
          <div className="flex items-center">
            {!isLarge && (
              <IconButton onClick={() => setOpenMenu(!openMenu)}>
                <MenuIcon />
              </IconButton>
            )}

            <h1
              onClick={() => navigate('/')}
              className="logo text-primary-color cursor-pointer text-xl md:text-2xl font-bold ml-1 md:ml-2"
            >
              Vendor Name
            </h1>

            {/* Mobile Drawer */}
            <Drawer
              anchor="left"
              sx={{ zIndex: 1500 }}
              open={openMenu}
              onClose={() => setOpenMenu(false)}
            >
              <Box sx={{ width: 350 }}>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <p className="text-primary-color font-bold text-lg md:text-xl tracking-wide px-5">
                    Select Category
                  </p>
                  <Tooltip title="Close menu" placement="right" arrow>
                    <IconButton
                      onClick={() => setOpenMenu(false)}
                      sx={{
                        color: 'text.primary',
                        mr: 1,
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.05)',
                          transform: 'rotate(90deg)',
                        },
                      }}
                    >
                      <CloseRounded fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </div>

                <List>
                  {mainCategory.map((item) => {
                    const isActive =
                      selectedCategory === item.categoryId &&
                      showMobileDrawerMenu;

                    return (
                      <div key={item.categoryId}>
                        <ListItemButton
                          onClick={() => {
                            setSelectedCategory(item.categoryId);
                            setShowMobileDrawerMenu((prev) =>
                              selectedCategory === item.categoryId ? !prev : true
                            );
                          }}
                          className="transition-all duration-150"
                        >
                          <ListItemText
                            primary={item.name}
                            sx={{ color: '#1DB954' }}
                            className="font-bold italic"
                          />
                          {isActive ? (
                            <Box
                              sx={{
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                  transform: 'rotate(180deg)',
                                },
                              }}
                            >
                              <Tooltip title="Expand less" arrow placement="right">
                                <ExpandLess sx={{ color: '#1DB954' }} />
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                  transform: 'rotate(180deg)',
                                },
                              }}
                            >
                              <Tooltip title="Expand more" arrow placement="right">
                                <ExpandMore sx={{ color: '#1DB954' }} />
                              </Tooltip>
                            </Box>
                          )}
                        </ListItemButton>

                        <Collapse in={isActive} timeout="auto" unmountOnExit>
                          <MobileDrawerCategorySheet
                            selectedCategory={selectedCategory}
                          />
                        </Collapse>
                      </div>
                    );
                  })}
                </List>
              </Box>
            </Drawer>

            {/* Desktop Mega Menu */}
            {isLarge && !searchMode && (
              <ul className="flex items-center font-medium ml-10">
                {mainCategory.map((item, index) => (
                  <li
                    key={index}
                    onMouseEnter={() => {
                      setShowMegaMenu(true);
                      setSelectedCategory(item.categoryId);
                    }}
                    onMouseLeave={() => setShowMegaMenu(false)}
                    className="flex items-center duration-100 cursor-pointer h-[70px] px-4 hover:text-primary-color hover:border-b-2 border-primary-color"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}

            {/* Search Input */}
            {searchMode && (
              <Box
                sx={{
                  position: 'relative',
                  width: isLarge ? 700 : 250,
                  ml: 4,
                }}
              >
                <form onSubmit={handleSearchSubmit}>
                  <InputBase
                    id="searchBox"
                    placeholder="Search here ..."
                    value={searchQuery}
                    onChange={(e) => {
                      handleInputChange(e);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    fullWidth
                    sx={{
                      fontSize: 17,
                      padding: '4px 0',
                      fontFamily: 'cursive',
                    }}
                  />
                </form>

                {/* Recent Searches */}
                {!showSuggestions &&
                  searchQuery.trim() === '' &&
                  recentSearches.length > 0 && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: 35,
                        fontFamily: 'cursive',
                        width: isLarge ? '100%' : 250,
                        zIndex: 1501,
                      }}
                    >
                      <List>
                        {recentSearches.map((item, idx) => (
                          <ListItem key={idx} disablePadding
                            secondaryAction={
                              <Tooltip title="Remove recent search" arrow placement="right">
                                <IconButton
                                  edge="end"
                                  aria-label="recentsearch"
                                  onClick={() => removeSearchIndex(idx)}
                                >
                                  <HistoryRoundedIcon />
                                </IconButton>
                              </Tooltip>
                            }
                          >
                            <ListItemButton
                              onClick={() => {
                                setSearchQuery(item);
                                setShowSuggestions(true);
                              }}
                            >
                              <ListItemText primary={item} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}

                {/* API Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: 35,
                      fontFamily: 'cursive',
                      width: isLarge ? '100%' : 250,
                      zIndex: 1501,
                    }}
                  >
                    <List>
                      {filteredSuggestions.map((item: ProductSuggestionResponse, idx: number) => (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton
                            onMouseDown={() => {
                              navigate(`/products/search/${item.title}/searching.../result`);
                              setSearchMode(false);
                              setSearchQuery('');
                              setShowSuggestions(false);
                            }}
                          >
                            <ListItemText primary={item.title} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-4">
            <IconButton
              size="small"
              onClick={() => setSearchMode((prev) => !prev)}
            >
              <SearchRoundedIcon />
            </IconButton>

            {auth?.user ? (
              <Tooltip
                title="Account and Settings"
                slots={{ transition: Zoom }}
              >
                <Button
                  onClick={() => navigate('/account')}
                  className="flex items-center gap-2"
                  sx={{ color: 'text.primary', textTransform: 'none' }}
                >
                  <Avatar
                    src="https://i.pinimg.com/736x/fa/d5/e7/fad5e79954583ad50ccb3f16ee64f66d.jpg"
                    sx={{ width: 29, height: 29 }}
                  />
                  <span className="text-primary-color font-semibold hidden lg:block">
                    {auth.user?.fullName || 'Demo'}
                  </span>
                </Button>
              </Tooltip>
            ) : (
              <Button
                startIcon={<AccountCircleRoundedIcon />}
                variant="contained"
                onClick={() => navigate('/authentication')}
                color="primary"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
            )}

            <Tooltip title="Wishlists" slots={{ transition: Zoom }}>
              <IconButton onClick={() => navigate('/wishlist')} size="small">
                <FavoriteBorderRoundedIcon sx={{ fontSize: 29 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart" slots={{ transition: Zoom }}>
              <IconButton
                size="small"
                onClick={() => navigate('/cart')}
                sx={{ position: 'relative' }}
              >
                <AddShoppingCartRoundedIcon sx={{ fontSize: 29 }} />
                <CartBadge
                  badgeContent={cart.carts?.cartItems.length ?? 0}
                  overlap="circular"
                />
              </IconButton>
            </Tooltip>

            {isLarge && (
              <Button
                onClick={() => navigate('/become-seller')}
                variant="outlined"
                color="primary"
                startIcon={<StorefrontRounded />}
                size="small"
                sx={{ textTransform: 'none', ml: 1 }}
              >
                Become Seller
              </Button>
            )}
          </div>
        </div>

        {/* Mega menu portal */}
        {showMegaMenu &&
          !searchMode &&
          ReactDOM.createPortal(
            <div
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
              className="megaMenu fixed top-[4.41rem] left-20 right-20 duration-150"
              style={{ zIndex: 1500 }}
            >
              <MegaMenuCategorySheet selectedCategory={selectedCategory} />
            </div>,
            document.body
          )}
      </Box>

      {/* Floating Chatbot */}
      <ChatBot />

      {/* Floating Search Button */}
      {showSearchFab && !searchMode && (
        <IconButton
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            bgcolor: 'white',
            border: '1px solid #ccc',
            boxShadow: 3,
            '&:hover': { bgcolor: '#f5f5f5' },
            width: 50,
            height: 50,
            borderRadius: '50%',
            zIndex: 1600,
          }}
          id="searchBox"
          onClick={() => setSearchMode(true)}
        >
          <SearchRoundedIcon />
        </IconButton>
      )}
    </>
  );
};

export default Navbar;