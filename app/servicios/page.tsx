"use client";
import {
  FileText,
  Smartphone,
  Bus,
  CircleDollarSign,
  Globe,
  Landmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Landmark,
      title: t("services.money_transfers"),
      description: t("services.money_transfers_desc"),
      partners: [
        {
          name: "Intermex",
          logoUrl: "/logos/intermex_logo.png",
        },
        {
          name: "MoneyGram",
          logoUrl: "/logos/moneygram_logo.png",
        },
        {
          name: "Ria",
          logoUrl: "/logos/ria_logo.png",
        },
      ],
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200",
    },
    {
      icon: FileText,
      title: t("services.bill_payments"),
      description: t("services.bill_payments_desc"),
      partners: [
        {
          name: "FPUA",
          logoUrl: "/logos/fpua_logo.png",
        },
        {
          name: "FPL",
          logoUrl: "/logos/fpl_logo.png",
        },
        {
          name: "Comcast",
          logoUrl: "/logos/comcast_logo.png",
        },
        {
          name: "Dish Network",
          logoUrl: "/logos/dish_logo.png",
        },
      ],
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: Smartphone,
      title: t("services.mobile_topups"),
      description: t("services.mobile_topups_desc"),
      partners: [
        {
          name: "Boss Revolution",
          logoUrl: "/logos/br_logo.svg",
        },
        { name: "Sin Pin", logoUrl: "/logos/sinpin_logo.png" },
        {
          name: "Telcel",
          logoUrl: "/logos/telcel_logo.png",
        },
        {
          name: "Tigo",
          logoUrl: "/logos/tigo_logo.png",
        },
        {
          name: "Claro",
          logoUrl: "/logos/claro_logo.svg",
        },
        {
          name: "Movistar",
          logoUrl: "/logos/movistar_logo.png",
        },
        {
          name: "Natcom",
          logoUrl: "/logos/natcom_logo.png",
        },
        {
          name: "Digicel",
          logoUrl: "/logos/digicel_logo.png",
        },
      ],
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      icon: Bus,
      title: t("services.bus_tickets"),
      description: t("services.bus_tickets_desc"),
      partners: [
        {
          name: "Sultana",
          logoUrl: "/logos/sultana_logo.webp",
        },
        {
          name: "Tornado",
          logoUrl: "/logos/tornado_logo.png",
        },
      ],
      color: "bg-orange-100 text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      icon: CircleDollarSign,
      title: t("services.check_cashing"),
      description: t("services.check_cashing_desc"),
      partners: [
        { name: "1% bajo $1,000", logoUrl: "" },
        { name: "1.5% bajo $2,000", logoUrl: "" },
        { name: "Tarifas competitivas", logoUrl: "" },
      ],
      color: "bg-red-100 text-red-600",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... Header remains the same ... */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("services.title")}
          </h1>
          <div className="w-94 h-1 bg-gradient-to-r from-green-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("services.titleDescription")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`overflow-hidden border-2 ${service.borderColor} hover:shadow-lg transition-shadow`}
            >
              <CardContent className="p-0">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`p-8 flex flex-col justify-center ${
                      index % 2 === 1 ? "lg:col-start-2" : ""
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mb-6`}
                    >
                      <service.icon className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Partners/Features */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {service.title.includes("Cheques")
                          ? "Tarifas:"
                          : "Socios y Servicios:"}
                      </h3>
                      <div className="flex flex-wrap gap-4 items-center">
                        {service.partners.map((partner, partnerIndex) =>
                          partner.logoUrl ? (
                            //  MODIFICATION START
                            <div
                              key={partnerIndex}
                              // Add a height class here (e.g., h-12)
                              className="relative h-12 w-32 p-2 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-center"
                            >
                              <Image
                                src={partner.logoUrl}
                                alt={`${partner.name} logo`}
                                // Use `fill` to make the image adapt to the parent container
                                fill
                                // Keep `object-contain` to maintain aspect ratio
                                className="object-contain"
                                // The `sizes` prop helps Next.js optimize for different screen sizes
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          ) : (
                            // MODIFICATION END
                            <span
                              key={partnerIndex}
                              className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                            >
                              {partner.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image/Visual */}
                  <div
                    className={`bg-gradient-to-br ${service.color.replace(
                      "100",
                      "50"
                    )} p-8 flex items-center justify-center ${
                      index % 2 === 1 ? "lg:col-start-1" : ""
                    }`}
                  >
                    <div
                      className={`w-32 h-32 rounded-full ${service.color} flex items-center justify-center`}
                    >
                      <service.icon className="h-16 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* International Services Highlight */}
        <Card className="mt-12 bg-gradient-to-r from-green-600 to-red-600 text-white">
          <CardContent className="p-8 text-center">
            <Globe className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{t("services.title")}</h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto">
              {t("services.title")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="font-bold text-lg">México</div>
                <div className="text-sm opacity-90">Telcel, Movistar</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Honduras</div>
                <div className="text-sm opacity-90">Tigo, Claro</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Guatemala</div>
                <div className="text-sm opacity-90">Tigo, Claro</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">El Salvador</div>
                <div className="text-sm opacity-90">Tigo, Movistar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-white border-2 border-yellow-400">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Necesitas más información?
              </h2>
              <p className="text-gray-600 mb-6">
                Visítanos en la tienda o llámanos para obtener más detalles
                sobre nuestros servicios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <span className="font-semibold">
                    📍 1508 Delaware Ave, Fort Pierce, FL
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <span className="font-semibold">📞 (772) 242-1416</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
