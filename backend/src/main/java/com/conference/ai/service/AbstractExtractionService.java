package com.conference.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
public class AbstractExtractionService {

    private static final String PDF_TYPE = "application/pdf";
    private static final String DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    /**
     * Extracts plain text from an uploaded PDF or DOCX file.
     * Validates content type before processing.
     */
    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or not provided.");
        }

        String contentType = file.getContentType();
        log.info("AbstractExtractionService.extractText() called | contentType={}", contentType);

        if (contentType == null) {
            throw new IllegalArgumentException("Unable to determine file type.");
        }

        return switch (contentType) {
            case PDF_TYPE -> extractFromPdf(file);
            case DOCX_TYPE -> extractFromDocx(file);
            default -> throw new IllegalArgumentException(
                    "Unsupported file type: " + contentType + ". Only PDF and DOCX are supported.");
        };
    }

    /**
     * Extracts text from a PDF file using Apache PDFBox.
     * Handles corrupted/invalid PDFs gracefully.
     */
    private String extractFromPdf(MultipartFile file) {
        log.info("Extracting text from PDF file...");
        try (InputStream is = file.getInputStream();
             PDDocument document = Loader.loadPDF(is.readAllBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.isBlank()) {
                throw new RuntimeException("PDF file contains no extractable text.");
            }
            log.info("PDF text extraction successful | {} characters extracted", text.trim().length());
            return text.trim();

        } catch (IOException e) {
            throw new RuntimeException("Failed to read PDF file. It may be corrupted or invalid.", e);
        }
    }

    /**
     * Extracts text from a DOCX file using Apache POI.
     * Handles corrupted/invalid DOCX files gracefully.
     */
    private String extractFromDocx(MultipartFile file) {
        log.info("Extracting text from DOCX file...");
        try (InputStream is = file.getInputStream();
             XWPFDocument document = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {

            String text = extractor.getText();

            if (text == null || text.isBlank()) {
                throw new RuntimeException("DOCX file contains no extractable text.");
            }
            log.info("DOCX text extraction successful | {} characters extracted", text.trim().length());
            return text.trim();

        } catch (IOException e) {
            throw new RuntimeException("Failed to read DOCX file. It may be corrupted or invalid.", e);
        }
    }
}
