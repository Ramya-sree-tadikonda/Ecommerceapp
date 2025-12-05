package com.ramya.ecommerceapplication.product;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Public: list active products with pagination + optional search by name
     *
     * Example:
     *  GET /api/products?page=0&size=12
     *  GET /api/products?page=1&size=8&search=iphone
     */
    @GetMapping
    public Page<Product> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search
    ) {
        log.info("Fetching products page={} size={} search={}", page, size, search);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (search != null && !search.isBlank()) {
            return productRepository.findByActiveTrueAndNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            return productRepository.findByActiveTrue(pageable);
        }
    }


    /**
     * 🔐 ADMIN:
     * List ALL products (active + inactive) with pagination + optional search.
     *
     * GET /api/products/admin?page=0&size=20
     * GET /api/products/admin?page=0&size=20&search=laptop
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")   // make sure method security is enabled
    public Page<Product> listProductsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        log.info("Fetching ADMIN products page={} size={} search={}", page, size, search);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN only: create product
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        product.setId(null);
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    // ADMIN only: update product
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestBody Product updated) {
        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setDescription(updated.getDescription());
                    existing.setPrice(updated.getPrice());
                    existing.setStock(updated.getStock());
                    existing.setActive(updated.getActive());
                    Product saved = productRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN only: soft delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(p -> {
                    p.setActive(false);
                    productRepository.save(p);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
