import user1 from 'src/assets/images/profile/user-1.jpg';
import user2 from 'src/assets/images/profile/user-2.jpg';
import user3 from 'src/assets/images/profile/user-3.jpg';
import user4 from 'src/assets/images/profile/user-4.jpg';
import user5 from 'src/assets/images/profile/user-5.jpg';
import { Chance } from 'chance';
import { http, HttpResponse } from 'msw';

const chance = new Chance();

let facturasData = [
  {
    id: 1,
    factura: 'F001-000000027',
    fechaEmision: '12-02-2021',
    fechaVencimiento: '20-02-2021',
    estado: 'Vencida',
    monto: 'S/9,840.00',
    subtotal: 'S/12,021.64',
    descuento: 'S/21.64',
    impuestos: 'S/2,160.00',
    metodo: 'Tarjeta de Crédito',
    cliente: 'Liam González',
    email: 'liam.gonzalez@email.com',
    telefono: '155-239-3578',
    direccion: '2089, Runolfsson Harbors Suite 886 - Chapel Hill, TX / 32827',
    items: [
      {
        id: 1,
        descripcion: 'Apply These 7 Secret Techniques To Improve Event',
        cantidad: 5,
        precioUnitario: 70.18,
        total: 350.9,
      },
      {
        id: 2,
        descripcion: 'Believing These 7 Myths About Event Keeps You From Growing',
        cantidad: 23,
        precioUnitario: 48.1,
        total: 1106.3,
      },
      {
        id: 3,
        descripcion: "Don't Waste Time! 7 Facts Until You Reach Your Event",
        cantidad: 25,
        precioUnitario: 78.18,
        total: 1954.5,
      },
      {
        id: 4,
        descripcion: 'Apply These 7 Secret Techniques To Improve Event',
        cantidad: 38,
        precioUnitario: 90.18,
        total: 3426.84,
      },
      {
        id: 5,
        descripcion: 'Believing These 7 Myths About Event Keeps You From Growing',
        cantidad: 45,
        precioUnitario: 115.18,
        total: 5183.1,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 2,
    factura: 'F001-000000028',
    fechaEmision: '15-02-2020',
    fechaVencimiento: '25-02-2020',
    estado: 'Pendiente',
    monto: 'S/1,850.00',
    subtotal: 'S/2,000.00',
    descuento: 'S/50.00',
    impuestos: 'S/360.00',
    metodo: 'Transferencia Bancaria',
    cliente: 'Steve Martínez',
    email: 'steve.martinez@email.com',
    telefono: '155-239-3579',
    direccion: '2090, Martínez Street Suite 887 - Miami, FL / 32828',
    items: [
      {
        id: 1,
        descripcion: 'The Ultimate Guide To Event Planning Success',
        cantidad: 10,
        precioUnitario: 150.0,
        total: 1500.0,
      },
      {
        id: 2,
        descripcion: 'Event Management Strategies That Actually Work',
        cantidad: 5,
        precioUnitario: 70.0,
        total: 350.0,
      },
      {
        id: 3,
        descripcion: 'How To Create Memorable Event Experiences',
        cantidad: 12,
        precioUnitario: 85.0,
        total: 1020.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 3,
    factura: 'F001-000000029',
    fechaEmision: '15-02-2020',
    fechaVencimiento: '25-02-2020',
    estado: 'Pagada',
    monto: 'S/2,500.00',
    subtotal: 'S/2,700.00',
    descuento: 'S/100.00',
    impuestos: 'S/486.00',
    metodo: 'Efectivo',
    cliente: 'Jack Rivera',
    email: 'jack.rivera@email.com',
    telefono: '155-239-3580',
    direccion: '2091, Rivera Avenue Suite 888 - Los Angeles, CA / 32829',
    items: [
      {
        id: 1,
        descripcion: 'Event Planning Secrets Revealed',
        cantidad: 15,
        precioUnitario: 120.0,
        total: 1800.0,
      },
      {
        id: 2,
        descripcion: 'The Art of Successful Event Coordination',
        cantidad: 7,
        precioUnitario: 100.0,
        total: 700.0,
      },
      {
        id: 3,
        descripcion: 'Building Lasting Event Partnerships',
        cantidad: 9,
        precioUnitario: 95.0,
        total: 855.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 4,
    factura: 'F001-000000030',
    fechaEmision: '15-02-2020',
    fechaVencimiento: '25-02-2020',
    estado: 'Vencida',
    monto: 'S/1,200.00',
    subtotal: 'S/1,300.00',
    descuento: 'S/50.00',
    impuestos: 'S/234.00',
    metodo: 'Tarjeta de Débito',
    cliente: 'Steve López',
    email: 'steve.lopez@email.com',
    telefono: '155-239-3581',
    direccion: '2092, López Boulevard Suite 889 - Chicago, IL / 32830',
    items: [
      {
        id: 1,
        descripcion: 'Event Marketing Mastery Techniques',
        cantidad: 8,
        precioUnitario: 150.0,
        total: 1200.0,
      },
      {
        id: 2,
        descripcion: 'Digital Event Promotion Strategies',
        cantidad: 6,
        precioUnitario: 125.0,
        total: 750.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 5,
    factura: 'F001-000000031',
    fechaEmision: '15-02-2020',
    fechaVencimiento: '25-02-2020',
    estado: 'Vencida',
    monto: 'S/800.00',
    subtotal: 'S/850.00',
    descuento: 'S/25.00',
    impuestos: 'S/153.00',
    metodo: 'Yape',
    cliente: 'Liam Rodríguez',
    email: 'liam.rodriguez@email.com',
    telefono: '155-239-3582',
    direccion: '2093, Rodríguez Street Suite 890 - Houston, TX / 32831',
    items: [
      {
        id: 1,
        descripcion: 'Servicio de Transporte Premium - Zona Centro',
        cantidad: 4,
        precioUnitario: 200.0,
        total: 800.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 6,
    factura: 'F001-000000032',
    fechaEmision: '15-02-2020',
    fechaVencimiento: '25-02-2020',
    estado: 'Pendiente',
    monto: 'S/1,500.00',
    subtotal: 'S/1,600.00',
    descuento: 'S/60.00',
    impuestos: 'S/288.00',
    metodo: 'Plin',
    cliente: 'Jack Fernández',
    email: 'jack.fernandez@email.com',
    telefono: '155-239-3583',
    direccion: '2094, Fernández Avenue Suite 891 - Phoenix, AZ / 32832',
    items: [
      {
        id: 1,
        descripcion: 'Servicio de Transporte Ejecutivo - Zona Norte',
        cantidad: 12,
        precioUnitario: 125.0,
        total: 1500.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 7,
    factura: 'F001-000000033',
    fechaEmision: '15-02-2020',
    fechaVencimiento: '25-02-2020',
    estado: 'Pagada',
    monto: 'S/3,200.00',
    subtotal: 'S/3,400.00',
    descuento: 'S/120.00',
    impuestos: 'S/612.00',
    metodo: 'Efectivo',
    cliente: 'Steve Herrera',
    email: 'steve.herrera@email.com',
    telefono: '155-239-3584',
    direccion: '2095, Herrera Boulevard Suite 892 - Philadelphia, PA / 32833',
    items: [
      {
        id: 1,
        descripcion: 'Servicio de Transporte VIP - Zona Sur',
        cantidad: 20,
        precioUnitario: 160.0,
        total: 3200.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
  {
    id: 8,
    factura: 'F001-000000034',
    fechaEmision: '01-02-2021',
    fechaVencimiento: '11-02-2021',
    estado: 'Vencida',
    monto: 'S/1,800.00',
    subtotal: 'S/1,900.00',
    descuento: 'S/70.00',
    impuestos: 'S/342.00',
    metodo: 'Tarjeta de Crédito',
    cliente: 'John Morales',
    email: 'john.morales@email.com',
    telefono: '155-239-3585',
    direccion: '2096, Morales Street Suite 893 - San Antonio, TX / 32834',
    items: [
      {
        id: 1,
        descripcion: 'Servicio de Transporte Premium - Zona Este',
        cantidad: 9,
        precioUnitario: 200.0,
        total: 1800.0,
      },
    ],
    empresa: {
      nombre: 'SONRISAS',
      direccion: '2089, Runolfsson Harbors Suite 886 - Lima Perú',
      telefono: '955-439-2578',
      email: 'admin@sonrisas.com',
      banco: 'Swiss Bank',
      cuenta: '1234567890',
      swiftCode: '12swisbank',
    },
  },
];

export default facturasData;

export const FacturacionHandlers = [
  // Mock GET request to retrieve Facturacion data
  http.get('/api/data/facturacion/FacturacionData', () => {
    try {
      return HttpResponse.json({ status: 200, msg: 'Success', data: facturasData });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),

  // Mock DELETE endpoint for deleting a factura
  http.delete('/api/data/facturacion/delete', async ({ request }) => {
    try {
      const { id } = await request.json();
      facturasData = facturasData.filter((factura) => factura.id !== id);
      return HttpResponse.json({ status: 200, msg: 'Success', data: facturasData });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),
];
