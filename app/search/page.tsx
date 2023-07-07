import {PRICE, PrismaClient} from '@prisma/client';
import React from 'react';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import SearchSideBar from './components/SearchSideBar';

const prisma = new PrismaClient();

interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const fetchRestaurantsByCity = async (searchParams: SearchParams) => {
  const where: any = {};
  if (searchParams.city) {
    const location = {
      name: {equals: searchParams.city.toLowerCase()},
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cuisine = {
      name: {equals: searchParams.cuisine.toLowerCase()},
    };
    where.cuisine = cuisine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  const restaurants = await prisma.restaurant.findMany({
    where,
    select,
  });

  return restaurants;
};

const fetchLocations = async () => {
  const locations = await prisma.location.findMany();
  return locations;
};

const fetchCusines = async () => {
  const cuisines = await prisma.cuisine.findMany();
  return cuisines;
};

const SearchPage = async ({searchParams}: {searchParams: {city?: string; cuisine?: string; price?: PRICE}}) => {
  const restaurants = await fetchRestaurantsByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCusines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar locations={locations} cuisines={cuisines} searchParams={searchParams} />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map(restaurant => <RestaurantCard restaurant={restaurant} />)
          ) : (
            <p>Sorry, no data</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
