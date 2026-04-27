import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ComponentType, ReactNode } from 'react';

import { resolveDynamicPage } from '@/lib/api/resolveDynamicPage';

import LamiraPage from '@/components/LamiraPage';
import GreenEffortsPage from '@/components/GreenEffortsPage';
import CmsPage from '@/components/CmsPage';
import PickCartoonPage from '@/components/PickCartoonPage';
import CertificationsAchievementsPage from '@/components/CertificationsAchievementsPage';
import NgosPage from '@/components/NgosPage';
import CarbonNetZeroRoadmapPage from '@/components/CarbonNetZeroRoadmapPage';
import OurCompanyDynamicPage from '@/components/OurCompanyDynamicPage';
import ContactUsPage from '@/components/ContactUsPage';
import GovernanceManagementPage from '@/components/GovernanceManagementPage';
import { PageBuilder } from '@/components/pageBuilder/PageBuilder';
import { ProductCategoriesHubPage } from '@/components/pages/ProductCategoriesHubPage';
import ProductDetailLayout from '@/components/products/ProductDetailLayout';
import { AboutUsPageSection } from '@/components/sections/AboutUsPageSection';
import { IntroductionPageSection } from '@/components/sections/IntroductionPageSection';
import { VisionMissionPageSection } from '@/components/sections/VisionMissionPageSection';
import { VisionMissionLayoutPageSection } from '@/components/sections/VisionMissionLayoutPageSection';
import GovernanceManagementLayoutPageSection from '@/components/sections/GovernanceManagementLayoutPageSection';
import ProductCategoryPageSection from '@/components/sections/ProductCategoryPageSection';
import ProductIndustryDetailLayoutPageSection from '@/components/sections/ProductIndustryDetailLayoutPageSection';
import ProductIndustriesLayoutPage from '@/components/pages/ProductIndustriesLayoutPage';
import RAndDCentreLayoutPage from '@/components/pages/RAndDCentreLayoutPage';
import NpdLayoutPage from '@/components/pages/NpdLayoutPage';
import PilotPlantLayoutPage from '@/components/pages/PilotPlantLayoutPage';
import InnovationsLayoutPage from '@/components/pages/InnovationsLayoutPage';
import InsightsHubPage from '@/components/pages/InsightsHubPage';
import DefaultLayoutPage from '@/components/pages/DefaultLayoutPage';
import InsightsListingPage from '@/components/pages/InsightsListingPage';
import InsightsArticleDetailPage from '@/components/pages/InsightsArticleDetailPage';
import CareerLandingPage from '@/components/CareerLandingPage';
import MarketingServicesLayoutPage from '@/components/pages/MarketingServicesLayoutPage';
import MarketingServiceDetailLayoutPage from '@/components/pages/MarketingServiceDetailLayoutPage';
import TechnicalServicesLayoutPage from '@/components/pages/TechnicalServicesLayoutPage';
import TechnicalServiceDetailLayoutPage from '@/components/pages/TechnicalServiceDetailLayoutPage';
import ApiSeoJsonLd from '@/components/seo/ApiSeoJsonLd';
import type { DynamicPageData } from '@/fake-api/dynamic-pages';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const PACKAGING_MAIN = 'packaging' as const;

function withApiSeoJsonLd(pathname: string, seo: unknown, children: ReactNode) {
  return (
    <>
      <ApiSeoJsonLd pathname={pathname} seo={seo as Record<string, unknown> | null | undefined} />
      {children}
    </>
  );
}

function seoForDynamicPage(data: DynamicPageData): Record<string, unknown> | null {
  if (data.ourCompanyData?.seo) {
    const c = data.ourCompanyData.seo;
    const top = data.seo as { canonical_path?: string } | undefined;
    return {
      schema: c.schema as unknown,
      canonical_url: c.canonical_url ?? top?.canonical_path ?? null,
    } as Record<string, unknown>;
  }
  if (data.seo && typeof data.seo === 'object') {
    return data.seo as Record<string, unknown>;
  }
  return null;
}

const componentMap: Record<string, ComponentType<any>> = {
  lamira: LamiraPage,
  green: GreenEffortsPage,
  certifications: CertificationsAchievementsPage,
  'our-company': OurCompanyDynamicPage,
  'our-factory': OurCompanyDynamicPage,
  'carbon-roadmap': CarbonNetZeroRoadmapPage,
  'pick-carton': PickCartoonPage,
  'contact-us': ContactUsPage,
  'governance-management': GovernanceManagementPage,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug?.join('/') || '';
  const resolved = await resolveDynamicPage(fullSlug, 1);
  return resolved.metadata;
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const fullSlug = slug?.join('/') || '';
  const search = await searchParams;
  const pageParam = Array.isArray(search?.page) ? search?.page[0] : search?.page;
  const page = pageParam ? Number(pageParam) : 1;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const resolved = await resolveDynamicPage(fullSlug, safePage);

  switch (resolved.kind) {
    case 'api-layout': {
      const { layout, payload } = resolved;
      const pathPrefix = fullSlug ? `/${fullSlug.replace(/^\/+/, '')}` : '/';
      const wrap = (ui: ReactNode) =>
        withApiSeoJsonLd(pathPrefix, (payload.seo as Record<string, unknown> | null | undefined) ?? null, ui);

      switch (layout) {
        case 'npd':
        case 'innovation_detail_1':
          return wrap(<NpdLayoutPage data={payload.page} />);
        case 'pilot_plant':
        case 'innovation_detail_2':
          return wrap(<PilotPlantLayoutPage data={payload.page} />);
        case 'innovation':
          return wrap(<InnovationsLayoutPage data={payload.page} />);
        case 'insights_article_detail':
          return wrap(<InsightsArticleDetailPage data={payload.page} />);
        case 'insights_listing':
          return wrap(<InsightsListingPage data={payload.page} />);
        case 'insights':
          return wrap(<InsightsHubPage data={payload.page} />);
        case 'default':
          return wrap(
            <DefaultLayoutPage
              data={{
                slug: payload.slug as string,
                title: (payload.title as string) || '',
                content: (payload.content as string) || '',
                heroBackgroundImage:
                  typeof payload.heroBackgroundImage === 'string'
                    ? payload.heroBackgroundImage
                    : undefined,
              }}
            />,
          );
        case 'rnd_center':
          return wrap(<RAndDCentreLayoutPage data={payload.page} />);
        case 'product_industries':
          return wrap(<ProductIndustriesLayoutPage data={payload.page} />);
        case 'product_industry_detail':
          return wrap(<ProductIndustryDetailLayoutPageSection data={payload.page} />);
        case 'about_4':
          return wrap(
            <GovernanceManagementLayoutPageSection
              data={payload.page}
              activePath={`/${fullSlug}`}
            />,
          );
        case 'about_3':
          return wrap(
            <VisionMissionLayoutPageSection
              data={payload.page}
              activePath={`/${fullSlug}`}
            />,
          );
        case 'about_1':
          return wrap(
            <AboutUsPageSection
              hero={payload.page.hero}
              statistics={payload.page.statistics}
              journey={payload.page.journey}
              videoUrl={payload.page.videoUrl}
              navigation={payload.page.navigation}
              activePath={`/${fullSlug}`}
            />,
          );
        case 'about_2':
          return wrap(
            <IntroductionPageSection
              data={payload.page}
              activePath={`/${fullSlug}`}
            />,
          );
        case 'product_categories':
          return wrap(
            <ProductCategoriesHubPage
              pageData={payload.pageData as any}
              videoUrl={payload.videoUrl}
              pageContext={{
                mainCategory: payload.slug,
              }}
            />,
          );
        case 'product_category_detail_5':
        case 'product_category_detail_1':
        case 'product_category_detail_4':
        case 'product_category_detail_2':
        case 'product_category_detail_3':
          return wrap(
            <PageBuilder
              pageData={payload.pageData as any}
              pageContext={{
                mainCategory: PACKAGING_MAIN,
                subCategory: payload.slug,
              }}
            />,
          );
        case 'sustainability_1':
          return wrap(<PickCartoonPage data={payload.pageData} />);
        case 'sustainability_2':
          return wrap(<LamiraPage data={payload.pageData} />);
        case 'sustainability_3':
          return wrap(<GreenEffortsPage data={payload.pageData} />);
        case 'sustainability_4':
          return wrap(<CertificationsAchievementsPage data={payload.pageData} />);
        case 'sustainability_5':
          return wrap(<NgosPage data={payload.pageData} />);
        case 'sustainability_6':
          return wrap(<CarbonNetZeroRoadmapPage data={payload.pageData} />);
        case 'career':
          return wrap(<CareerLandingPage data={payload.pageData} />);
        case 'marketing_services':
          return wrap(<MarketingServicesLayoutPage data={payload.page} />);
        case 'marketing_service_detail':
          return wrap(<MarketingServiceDetailLayoutPage data={payload.page} />);
        case 'technical_services':
          return wrap(<TechnicalServicesLayoutPage data={payload.page} />);
        case 'technical_service_detail':
          return wrap(<TechnicalServiceDetailLayoutPage data={payload.page} />);
        case 'contact_us':
          return wrap(<ContactUsPage data={payload.page} />);
        default:
          break;
      }
      break;
    }
    case 'product-category': {
      const pathPrefix = fullSlug ? `/${fullSlug.replace(/^\/+/, '')}` : '/';
      return withApiSeoJsonLd(
        pathPrefix,
        (resolved.category as { seo?: Record<string, unknown> }).seo ?? null,
        <ProductCategoryPageSection category={resolved.category} products={resolved.products} />,
      );
    }
    case 'product': {
      const pathPrefix = fullSlug ? `/${fullSlug.replace(/^\/+/, '')}` : '/';
      return withApiSeoJsonLd(
        pathPrefix,
        resolved.product.seo as unknown as Record<string, unknown>,
        <ProductDetailLayout product={resolved.product} slugPath={resolved.slugPath} />,
      );
    }
    case 'sub-category':
      return (
        <PageBuilder
          pageData={resolved.pageData as any}
          pageContext={{
            mainCategory: PACKAGING_MAIN,
            subCategory: resolved.subCategory,
          }}
        />
      );
    case 'legacy-vision-mission': {
      const pathPrefix = fullSlug ? `/${fullSlug.replace(/^\/+/, '')}` : '/';
      return withApiSeoJsonLd(
        pathPrefix,
        (resolved.page as { seo?: Record<string, unknown> }).seo ?? null,
        <VisionMissionPageSection data={resolved.page} />,
      );
    }
    case 'dynamic': {
      const data = resolved.page;
      const pathPrefix = fullSlug ? `/${fullSlug.replace(/^\/+/, '')}` : '/';
      const wrapDyn = (ui: ReactNode) => withApiSeoJsonLd(pathPrefix, seoForDynamicPage(data), ui);

      if (data.type === 'green') {
        return wrapDyn(
          <GreenEffortsPage
            data={{
              title: data.title,
              heroBackgroundImage:
                typeof data.heroBackgroundImage === 'string'
                  ? data.heroBackgroundImage
                  : '/about_banner.jpg',
              greenSustainabilityVisionSection: data.greenSustainabilityVisionSection as any,
              greenPhotovoltaicProjectSections: data.greenPhotovoltaicProjectSections
                ? [{ htmlItems: [] }]
                : undefined,
              greenSustainabilityJourneySection: data.greenSustainabilityJourneySection as any,
            }}
          />,
        );
      }

      if (data.type === 'certifications') {
        return wrapDyn(
          <CertificationsAchievementsPage
            data={{
              title: data.title,
              heroBackgroundImage:
                typeof data.heroBackgroundImage === 'string'
                  ? data.heroBackgroundImage
                  : '/about_banner.jpg',
              certificationsGreenBuildingSection: data.certificationsGreenBuildingSection as any,
              certificationsSustainabilityTimelineSection:
                data.certificationsSustainabilityTimelineSection as any,
              certificationsCertificateTilesSection:
                data.certificationsCertificateTilesSection as any,
            }}
          />,
        );
      }

      if (data.type === 'carbon-roadmap') {
        return wrapDyn(
          <CarbonNetZeroRoadmapPage
            data={{
              title: data.title,
              heroBackgroundImage:
                typeof data.heroBackgroundImage === 'string'
                  ? data.heroBackgroundImage
                  : '/about_banner.jpg',
              carbonNetZeroRoadmapSection: data.carbonNetZeroRoadmapSection as any,
              carbonNetZeroPillarsSection: data.carbonNetZeroPillarsSection as any,
            }}
          />,
        );
      }

      const Component = componentMap[data.type] || CmsPage;
      return wrapDyn(<Component data={data} />);
    }
    case 'not-found':
      notFound();
      break;
    default:
      break;
  }

  notFound();
}
