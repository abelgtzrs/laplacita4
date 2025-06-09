"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  // -------------------------------English translations--------------------------------------------------------------
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.food": "Food",
    "nav.services": "Services",
    "nav.promotions": "Promotions",
    "nav.contact": "Contact",

    // Homepage
    "home.welcome": "Welcome to La Placita FTP",
    "home.subtitle": "Your local hispanic grocery store and service center.",
    "home.view_products": "View Products",
    "home.our_services": "Our Services",
    "home.featured_products": "Featured Products",
    "home.services_highlights": "Our Services",
    "home.current_promotions": "Current Promotions",
    "home.history_title": "Our History",
    "home.about_snippet":
      "At La Placita FTP, we take pride in being a part of the Fort Pierce community since the beginning—offering authentic Hispanic products, freshly prepared food, and essential services. More than just a store, we are a trusted space where quality, commitment, and human warmth come together to serve you the way you deserve.",

    // Products
    "products.title": "Our Products",
    "products.search": "Search products...",
    "products.all_categories": "All Categories",
    "products.sort_by": "Sort by",
    "products.sort.latest": "Latest",
    "products.sort.price_low": "Price: Low to High",
    "products.sort.price_high": "Price: High to Low",
    "products.sort.alphabetical": "Alphabetical",

    // Categories
    "category.meats": "Meats",
    "category.groceries": "Groceries",
    "category.produce": "Produce",
    "category.drinks": "Drinks",
    "category.dairy": "Dairy",
    "category.bakery": "Bakery",

    // Food
    "food.title": "Prepared Foods",
    "food.subtitle": "La Placita's Delights",
    "food.description":
      "Enjoy our delicious, authentic prepared foods made fresh daily with traditional recipes and the finest ingredients.",

    // Services
    "services.title": "Our Services",
    "services.titleDescription":
      "We offer a wide range of essential services to make your life easier and more convenient.",
    "services.money_transfers": "Money Transfers",
    "services.money_transfers_desc":
      "Fast, secure, and reliable money transfers with competitive rates.",
    "services.bill_payments": "Bill Payments",
    "services.bill_payments_desc": "Pay your bills conveniently at our store.",
    "services.mobile_topups": "Mobile Top-Ups",
    "services.mobile_topups_desc":
      "National and international mobile recharges.",
    "services.bus_tickets": "Bus Tickets",
    "services.bus_tickets_desc": "Purchase bus tickets for your travel needs.",
    "services.check_cashing": "Check Cashing",
    "services.check_cashing_desc":
      "Quick and affordable check cashing services.",
    "services.faxes": "Printing & Faxes",
    "services.faxes_desc": "Affordable printing and fax services available.",

    //Internation Services
    "services.title_int": "International Services",
    "services.description_int":
      "We connect our community with their families worldwide. Money transfers and mobile top-ups to Mexico, Honduras, Guatemala, El Salvador, and more countries.",

    // Promotions
    "promotions.title": "Special Promotions",
    "promotions.no_active": "Check back soon for new offers!",

    // Whatsapp
    "whatsapp.title": "Printing Services via WhatsApp",
    "whatsapp.subtitle":
      "Need to print a document? Send us your files via WhatsApp!",
    "whatsapp.button": "Send via WhatsApp",
    "whatsapp.format": "Accepted formats: PDF, Images, Word, Excel",
    fb: "Follow us on Facebook",

    // Contact
    "contact.title": "Contact Us",
    "contact.address": "Address",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.hours": "Hours of Operation",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone (Optional)",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",

    // Footer
    "footer.about":
      "Your trusted community grocery store serving Fort Pierce with authentic Hispanic products and essential services.",
    "footer.made_with_love": "Made with ❤️ for the community",

    // Admin
    "admin.login": "Admin Login",
    "admin.username": "Username",
    "admin.password": "Password",
    "admin.sign_in": "Sign In",
    "admin.manage_products": "Manage Products",
    "admin.manage_promotions": "Manage Promotions",
    "admin.logout": "Logout",
    "admin.add_product": "Add New Product",
    "admin.edit_product": "Edit Product",
    "admin.product_name": "Product Name",
    "admin.product_description": "Description",
    "admin.product_price": "Price",
    "admin.product_category": "Category",
    "admin.product_image": "Product Image",
    "admin.is_featured": "Featured Product",
    "admin.save": "Save",
    "admin.update": "Update",
    "admin.delete": "Delete",
    "admin.confirm_delete": "Are you sure you want to delete this item?",
  },

  // -------------------------------Spanish translations
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.products": "Productos",
    "nav.food": "Comida",
    "nav.services": "Servicios",
    "nav.promotions": "Promociones",
    "nav.contact": "Contacto",

    // Homepage
    "home.welcome": "¡Bienvenidos a La Placita FTP!",
    "home.subtitle": "Tu tienda hispana de confianza y centro de servicios",
    "home.view_products": "Ver Productos",
    "home.our_services": "Nuestros Servicios",
    "home.featured_products": "Productos Destacados",
    "home.services_highlights": "Nuestros Servicios",
    "home.current_promotions": "Promociones Actuales",
    "home.history_title": "Nuestra Historia",
    "home.about_snippet":
      "En La Placita FTP, nos enorgullece haber sido parte de la comunidad de Fort Pierce desde nuestros inicios, ofreciendo productos hispanos auténticos, alimentos frescos preparados diariamente y servicios esenciales. Más que una tienda, somos un espacio de confianza donde la calidad, el compromiso y la calidez humana se encuentran para servirte como mereces.",

    // Products
    "products.title": "Nuestros Productos",
    "products.search": "Buscar productos...",
    "products.all_categories": "Todas las Categorías",
    "products.sort_by": "Ordenar por",
    "products.sort.latest": "Más Recientes",
    "products.sort.price_low": "Precio: Menor a Mayor",
    "products.sort.price_high": "Precio: Mayor a Menor",
    "products.sort.alphabetical": "Alfabético",

    // Categories
    "category.meats": "Carnes",
    "category.groceries": "Abarrotes",
    "category.produce": "Frutas y Verduras",
    "category.drinks": "Bebidas",
    "category.dairy": "Lácteos",
    "category.bakery": "Panadería",

    // Food
    "food.title": "Comida Preparada",
    "food.subtitle": "Delicias de La Placita",
    "food.description":
      "Disfruta de nuestras deliciosas comidas auténticas preparadas frescas diariamente con recetas tradicionales y los mejores ingredientes.",

    // Services
    "services.title": "Nuestros Servicios",
    "services.titleDescription":
      "Ofrecemos una gran variedad de servicios esenciales para hacer tu vida más fácil y conveniente.",
    "services.money_transfers": "Envíos de Dinero",
    "services.money_transfers_desc":
      "Transferencias de dinero rápidas, seguras y confiables con tarifas competitivas.",
    "services.bill_payments": "Pago de Facturas",
    "services.bill_payments_desc":
      "Paga tus facturas cómodamente en nuestra tienda.",
    "services.mobile_topups": "Recargas Celulares",
    "services.mobile_topups_desc":
      "Recargas móviles nacionales e internacionales.",
    "services.bus_tickets": "Boletos de Autobús",
    "services.bus_tickets_desc":
      "Compra boletos de autobús para tus necesidades de viaje.",
    "services.check_cashing": "Cambio de Cheques",
    "services.check_cashing_desc":
      "Servicios de cambio de cheques rápidos y económicos.",
    "services.faxes": "Impresión & Faxes",
    "services.faxes_desc": "Servicios de impresión y fax disponibles.",

    // International Services
    "services.titleInt": "Servicios Internacionales",
    "services.descriptionInt":
      "Conectamos a nuestra comunidad con sus familias en todo el mundo. Envíos de dinero y recargas celulares a México, Honduras, Guatemala, El Salvador y más países.",

    // Promotions
    "promotions.title": "Promociones Especiales",
    "promotions.no_active": "¡Vuelve pronto para nuevas ofertas!",

    // Whatsapp
    "whatsapp.title": "Servicio de Impresión por WhatsApp",
    "whatsapp.subtitle":
      "¿Necesitas imprimir documentos? Envíanos tus archivos por WhatsApp y los tendremos listos para recoger.",
    "whatsapp.button": "Enviar Documentos por WhatsApp",
    "whatsapp.format":
      "Formatos aceptados: PDF, Word, Excel, PowerPoint, Imágenes",
    fb: "Síguenos en Facebook",

    // Contact
    "contact.title": "Contáctanos",
    "contact.address": "Dirección",
    "contact.phone": "Teléfono",
    "contact.email": "Correo",
    "contact.hours": "Horario de Atención",
    "contact.form.name": "Nombre",
    "contact.form.email": "Correo",
    "contact.form.phone": "Teléfono (Opcional)",
    "contact.form.subject": "Asunto",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar Mensaje",

    // Footer
    "footer.about":
      "Tu tienda comunitaria de confianza sirviendo a Fort Pierce con productos hispanos auténticos y servicios esenciales.",
    "footer.made_with_love": "Hecho con ❤️ para la comunidad",

    // Admin
    "admin.login": "Acceso Administrativo",
    "admin.username": "Usuario",
    "admin.password": "Contraseña",
    "admin.sign_in": "Iniciar Sesión",
    "admin.manage_products": "Gestionar Productos",
    "admin.manage_promotions": "Gestionar Promociones",
    "admin.logout": "Cerrar Sesión",
    "admin.add_product": "Agregar Nuevo Producto",
    "admin.edit_product": "Editar Producto",
    "admin.product_name": "Nombre del Producto",
    "admin.product_description": "Descripción",
    "admin.product_price": "Precio",
    "admin.product_category": "Categoría",
    "admin.product_image": "Imagen del Producto",
    "admin.is_featured": "Producto Destacado",
    "admin.save": "Guardar",
    "admin.update": "Actualizar",
    "admin.delete": "Eliminar",
    "admin.confirm_delete":
      "¿Estás seguro de que quieres eliminar este elemento?",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
